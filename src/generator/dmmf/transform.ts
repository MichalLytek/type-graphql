import { DMMF as PrismaDMMF } from "@prisma/client/runtime";
import { DMMF } from "./types";
import { parseDocumentationAttributes } from "./helpers";
import {
  getInputTypeName,
  camelCase,
  getModelNameFromInputType,
  getTypeGraphQLType,
  getFieldTSType,
  pascalCase,
  cleanDocsString,
} from "../helpers";
import { DmmfDocument } from "./dmmf-document";
import pluralize from "pluralize";
import { GenerateCodeOptions } from "../options";
import { supportedQueryActions, supportedMutationActions } from "../config";

export function transformSchema(
  datamodel: PrismaDMMF.Schema,
  dmmfDocument: DmmfDocument,
): Omit<DMMF.Schema, "enums"> {
  return {
    inputTypes: datamodel.inputTypes.map(transformInputType(dmmfDocument)),
    outputTypes: datamodel.outputTypes.map(transformOutputType(dmmfDocument)),
    rootMutationType: datamodel.rootMutationType,
    rootQueryType: datamodel.rootQueryType,
  };
}

export function transformMappings(
  mapping: PrismaDMMF.Mapping[],
  dmmfDocument: DmmfDocument,
  options: GenerateCodeOptions,
): DMMF.Mapping[] {
  return mapping.map(transformMapping(dmmfDocument, options));
}

export function transformBareModel(model: PrismaDMMF.Model): DMMF.Model {
  const attributeArgs = parseDocumentationAttributes<{ name: string }>(
    model.documentation,
    "type",
    "model",
  );
  return {
    ...model,
    typeName: attributeArgs.name ?? pascalCase(model.name),
    fields: [],
    docs: cleanDocsString(model.documentation),
  };
}

export function transformModelWithFields(dmmfDocument: DmmfDocument) {
  return (model: PrismaDMMF.Model): DMMF.Model => {
    return {
      ...transformBareModel(model),
      fields: model.fields.map(transformField(dmmfDocument)),
    };
  };
}

function transformField(dmmfDocument: DmmfDocument) {
  return (field: PrismaDMMF.Field): DMMF.Field => {
    const attributeArgs = parseDocumentationAttributes<{ name: string }>(
      field.documentation,
      "field",
      "field",
    );
    const fieldTSType = getFieldTSType(
      dmmfDocument,
      field,
      field.isRequired,
      false,
    );
    const typeGraphQLType = getTypeGraphQLType(field, dmmfDocument);
    const { output = false, input = false } = parseDocumentationAttributes<{
      output: boolean;
      input: boolean;
    }>(field.documentation, "omit", "field");
    return {
      ...field,
      typeFieldAlias: attributeArgs.name,
      fieldTSType,
      typeGraphQLType,
      docs: cleanDocsString(field.documentation),
      isOmitted: { output, input },
    };
  };
}

function transformInputType(dmmfDocument: DmmfDocument) {
  return (inputType: PrismaDMMF.InputType): DMMF.InputType => {
    const modelName = getModelNameFromInputType(inputType.name);
    const modelType = modelName
      ? dmmfDocument.datamodel.models.find(it => it.name === modelName)
      : undefined;
    return {
      ...inputType,
      typeName: getInputTypeName(inputType.name, dmmfDocument),
      fields: inputType.fields.map<DMMF.SchemaArg>(field => {
        const modelField = modelType?.fields.find(it => it.name === field.name);
        const typeName = modelField?.typeFieldAlias ?? field.name;
        const selectedInputType = selectInputTypeFromTypes(dmmfDocument)(
          field.inputTypes,
        );
        const typeGraphQLType = getTypeGraphQLType(
          selectedInputType,
          dmmfDocument,
        );
        const fieldTSType = getFieldTSType(
          dmmfDocument,
          selectedInputType,
          field.isRequired,
          true,
        );
        return {
          ...field,
          selectedInputType,
          typeName,
          typeGraphQLType,
          fieldTSType,
          hasMappedName: field.name !== typeName,
        };
      }),
    };
  };
}

function transformOutputType(dmmfDocument: DmmfDocument) {
  return (outputType: PrismaDMMF.OutputType): DMMF.OutputType => {
    // TODO: make it more future-proof
    const modelName = outputType.name.replace("Aggregate", "");
    const typeName = getMappedOutputTypeName(dmmfDocument, outputType.name);

    return {
      ...outputType,
      modelName,
      typeName,
      fields: outputType.fields.map<DMMF.OutputSchemaField>(field => {
        const outputType: DMMF.SchemaField["outputType"] = {
          ...field.outputType,
          type: getMappedOutputTypeName(
            dmmfDocument,
            field.outputType.type as string,
          ),
        };
        const fieldTSType = getFieldTSType(
          dmmfDocument,
          outputType,
          field.isRequired,
          false,
        );
        const typeGraphQLType = getTypeGraphQLType(outputType, dmmfDocument);
        const args = field.args.map<DMMF.SchemaArg>(arg => {
          const selectedInputType = selectInputTypeFromTypes(dmmfDocument)(
            arg.inputTypes,
          );
          const typeGraphQLType = getTypeGraphQLType(
            selectedInputType,
            dmmfDocument,
          );
          const fieldTSType = getFieldTSType(
            dmmfDocument,
            selectedInputType,
            arg.isRequired,
            true,
          );

          return {
            ...arg,
            selectedInputType,
            fieldTSType,
            typeGraphQLType,
            hasMappedName: arg.name !== typeName,
            // TODO: add proper mapping in the future if needed
            typeName: arg.name,
          };
        });
        const argsTypeName =
          args.length > 0
            ? `${typeName}${pascalCase(field.name)}Args`
            : undefined;

        return {
          ...field,
          outputType,
          fieldTSType,
          typeGraphQLType,
          args,
          argsTypeName,
        };
      }),
    };
  };
}

function getMappedOutputTypeName(
  dmmfDocument: DmmfDocument,
  outputTypeName: string,
): string {
  if (outputTypeName.startsWith("Aggregate")) {
    return `Aggregate${dmmfDocument.getModelTypeName(
      outputTypeName.replace("Aggregate", ""),
    )}`;
  }

  const dedicatedTypeSuffix = [
    "MinAggregateOutputType",
    "MaxAggregateOutputType",
    "AvgAggregateOutputType",
    "SumAggregateOutputType",
  ].find(type => outputTypeName.includes(type));
  if (dedicatedTypeSuffix) {
    const modelName = outputTypeName.replace(dedicatedTypeSuffix, "");
    return `${dmmfDocument.getModelTypeName(modelName)}${dedicatedTypeSuffix}`;
  }

  return outputTypeName;
}

function transformMapping(
  dmmfDocument: DmmfDocument,
  options: GenerateCodeOptions,
) {
  return (mapping: PrismaDMMF.Mapping): DMMF.Mapping => {
    const { model, plural, ...availableActions } = mapping;
    const modelTypeName = dmmfDocument.getModelTypeName(model) ?? model;
    const actions = Object.entries(availableActions)
      .filter(([actionKind]) => getOperationKindName(actionKind))
      .map<DMMF.Action>(([modelAction, fieldName]) => {
        const kind = modelAction as DMMF.ModelAction;
        const actionOutputType = dmmfDocument.schema.outputTypes.find(type =>
          type.fields.some(field => field.name === fieldName),
        );
        if (!actionOutputType) {
          throw new Error(
            `Cannot find type with field ${fieldName} in root types definitions!`,
          );
        }
        const method = actionOutputType.fields.find(
          field => field.name === fieldName,
        )!;
        const argsTypeName =
          method.args.length > 0
            ? `${pascalCase(
                `${kind}${dmmfDocument.getModelTypeName(mapping.model)}`,
              )}Args`
            : undefined;
        const outputTypeName = method.outputType.type as string;
        const actionResolverName = `${pascalCase(
          kind,
        )}${modelTypeName}Resolver`;

        return {
          name: getMappedActionName(kind, modelTypeName, options),
          fieldName,
          kind: kind,
          operation: getOperationKindName(kind)!,
          method,
          argsTypeName,
          outputTypeName,
          actionResolverName,
        };
      });
    const resolverName = `${modelTypeName}CrudResolver`;
    return {
      model,
      plural,
      actions,
      collectionName: camelCase(mapping.model),
      resolverName,
    };
  };
}

function selectInputTypeFromTypes(dmmfDocument: DmmfDocument) {
  return (
    inputTypes: PrismaDMMF.SchemaArgInputType[],
  ): DMMF.SchemaArgInputType => {
    let possibleInputTypes: PrismaDMMF.SchemaArgInputType[];
    possibleInputTypes = inputTypes.filter(it => it.kind === "object");
    if (possibleInputTypes.length === 0) {
      possibleInputTypes = inputTypes.filter(it => it.kind === "enum");
    }
    if (possibleInputTypes.length === 0) {
      possibleInputTypes = inputTypes;
    }
    const selectedInputType =
      possibleInputTypes.find(it => it.isList) || possibleInputTypes[0];

    let inputType = selectedInputType.type as string;
    if (selectedInputType.kind === "enum") {
      const enumDef = dmmfDocument.enums.find(it => it.name === inputType)!;
      inputType = enumDef.typeName;
    } else if (selectedInputType.kind === "object") {
      inputType = getInputTypeName(inputType, dmmfDocument);
    }

    return {
      ...selectedInputType,
      argType: selectedInputType.type as DMMF.ArgType, // input type mapping
      type: inputType,
    };
  };
}

function getMappedActionName(
  actionName: DMMF.ModelAction,
  typeName: string,
  options: GenerateCodeOptions,
): string {
  const defaultMappedActionName = `${actionName}${typeName}`;
  if (options.useOriginalMapping) {
    return defaultMappedActionName;
  }

  const hasNoPlural = typeName === pluralize(typeName);
  if (hasNoPlural) {
    return defaultMappedActionName;
  }

  switch (actionName) {
    case "findOne": {
      return camelCase(typeName);
    }
    case "findMany": {
      return pluralize(camelCase(typeName));
    }
    default: {
      return defaultMappedActionName;
    }
  }
}

function getOperationKindName(actionName: string) {
  if ((supportedQueryActions as string[]).includes(actionName)) {
    return "Query";
  }
  if ((supportedMutationActions as string[]).includes(actionName)) {
    return "Mutation";
  }
  // throw new Error(`Unsupported operation kind: '${actionName}'`);
}

export function transformEnums(dmmfDocument: DmmfDocument) {
  return (
    enumDef: PrismaDMMF.DatamodelEnum | PrismaDMMF.SchemaEnum,
  ): DMMF.Enum => {
    const modelName = enumDef.name.includes("DistinctFieldEnum")
      ? enumDef.name.replace("DistinctFieldEnum", "")
      : undefined;
    const typeName = modelName
      ? `${dmmfDocument.getModelTypeName(modelName)}DistinctFieldEnum`
      : enumDef.name;
    const enumValues = enumDef.values as Array<
      | PrismaDMMF.DatamodelEnum["values"][number]
      | PrismaDMMF.SchemaEnum["values"][number]
    >;

    return {
      ...enumDef,
      docs:
        "documentation" in enumDef
          ? cleanDocsString(enumDef.documentation)
          : undefined,
      typeName,
      valuesMap: enumValues.map(enumValue => {
        const enumValueName =
          typeof enumValue === "string" ? enumValue : enumValue.name;
        return {
          value: enumValueName,
          name:
            (modelName &&
              dmmfDocument.getModelFieldAlias(modelName, enumValueName)) ||
            enumValueName,
        };
      }),
    };
  };
}

export function generateRelationModel(dmmfDocument: DmmfDocument) {
  return (model: DMMF.Model): DMMF.RelationModel => {
    const outputType = dmmfDocument.schema.outputTypes.find(
      type => type.name === model.name,
    )!;
    const resolverName = `${model.typeName}RelationsResolver`;
    const relationFields = model.fields
      .filter(field => field.relationName && !field.isOmitted.output)
      .map<DMMF.RelationField>(field => {
        const outputTypeField = outputType.fields.find(
          it => it.name === field.name,
        )!;
        const argsTypeName =
          outputTypeField.args.length > 0
            ? `${model.typeName}${pascalCase(field.name)}Args`
            : undefined;

        return {
          ...field,
          outputTypeField,
          argsTypeName,
        };
      });

    return {
      model,
      outputType,
      relationFields,
      resolverName,
    };
  };
}
