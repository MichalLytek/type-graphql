import { DMMF as PrismaDMMF } from "@prisma/client/runtime/dmmf-types";
import { DMMF } from "./types";
import { parseDocumentationAttributes } from "./helpers";
import { getInputTypeName, camelCase } from "../helpers";
import { DmmfDocument } from "./dmmf-document";
import pluralize from "pluralize";
import { GenerateCodeOptions } from "../options";
import { supportedQueryActions, supportedMutationActions } from "../config";

export function transformDatamodel(
  datamodel: PrismaDMMF.Datamodel,
): DMMF.Datamodel {
  return {
    enums: datamodel.enums,
    models: datamodel.models.map(transformModel),
  };
}

export function transformSchema(
  datamodel: PrismaDMMF.Schema,
  dmmfDocument: DmmfDocument,
): DMMF.Schema {
  return {
    enums: datamodel.enums,
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

function transformModel(model: PrismaDMMF.Model): DMMF.Model {
  const attributeArgs = parseDocumentationAttributes(
    model.documentation,
    "type",
    "model",
  );
  const typeName = attributeArgs?.slice(1, -1);
  return {
    ...model,
    typeName: typeName ?? model.name,
    fields: model.fields.map(transformField),
  };
}

function transformField(field: PrismaDMMF.Field): DMMF.Field {
  const attributeArgs = parseDocumentationAttributes(
    field.documentation,
    "field",
    "field",
  );
  const typeFieldAlias = attributeArgs?.slice(1, -1);
  return {
    ...field,
    typeFieldAlias,
  };
}

function transformInputType(dmmfDocument: DmmfDocument) {
  return (inputType: PrismaDMMF.InputType): DMMF.InputType => {
    return {
      ...inputType,
      typeName: getInputTypeName(inputType.name, dmmfDocument),
      fields: inputType.fields.map(field => ({
        ...field,
        selectedInputType: selectInputTypeFromTypes(dmmfDocument)(
          field.inputType,
        ),
      })),
    };
  };
}

function transformOutputType(dmmfDocument: DmmfDocument) {
  return (outputType: PrismaDMMF.OutputType): DMMF.OutputType => {
    return {
      ...outputType,
      fields: outputType.fields.map<DMMF.SchemaField>(field => ({
        ...field,
        outputType: {
          ...field.outputType,
          type: field.outputType.type as string,
        },
        args: field.args.map<DMMF.SchemaArg>(arg => ({
          ...arg,
          selectedInputType: selectInputTypeFromTypes(dmmfDocument)(
            arg.inputType,
          ),
        })),
      })),
    };
  };
}

function transformMapping(
  dmmfDocument: DmmfDocument,
  options: GenerateCodeOptions,
) {
  return (mapping: PrismaDMMF.Mapping): DMMF.Mapping => {
    const { model, plural, ...availableActions } = mapping;
    const actions = Object.entries(availableActions).map<DMMF.Action>(
      ([modelAction, fieldName]) => {
        const kind = modelAction as DMMF.ModelAction;
        const modelName = dmmfDocument.getModelTypeName(model) ?? model;
        return {
          name: getMappedActionName(kind, modelName, options),
          fieldName,
          kind: kind,
          operation: getOperationKindName(kind) as any,
        };
      },
    );
    return { model, plural, actions };
  };
}

function selectInputTypeFromTypes(dmmfDocument: DmmfDocument) {
  return (
    inputTypes: PrismaDMMF.SchemaArgInputType[],
  ): DMMF.SchemaArgInputType => {
    const selectedInputType =
      inputTypes.find(it => it.kind === "object") ||
      inputTypes.find(it => it.kind === "enum") ||
      inputTypes[0];
    const inputType = selectedInputType.type as string;
    return {
      ...selectedInputType,
      argType: selectedInputType.type as DMMF.ArgType, // input type mapping
      type:
        selectedInputType.kind === "object"
          ? getInputTypeName(inputType, dmmfDocument)
          : inputType,
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

function getOperationKindName(actionName: string): string | undefined {
  if (supportedQueryActions.includes(actionName as any)) return "Query";
  if (supportedMutationActions.includes(actionName as any)) return "Mutation";
}
