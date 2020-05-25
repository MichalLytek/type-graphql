import { DMMF as PrismaDMMF } from "@prisma/client/runtime/dmmf-types";
import { DMMF } from "./types";
import { parseDocumentationAttributes } from "./helpers";
import { getInputTypeName } from "../helpers";
import { DmmfDocument } from "./dmmf-document";

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
