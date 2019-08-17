import {
  SourceFile,
  PropertyDeclarationStructure,
  OptionalKind,
} from "ts-morph";
import { DMMF } from "@prisma/photon/dist/runtime/dmmf-types";

export default async function generateClassFromModel(
  sourceFile: SourceFile,
  model: DMMF.Model,
) {
  sourceFile.addClass({
    name: model.name,
    isExported: true,
    ...(model.documentation && {
      docs: [{ description: model.documentation }],
    }),
    properties: model.fields.map<OptionalKind<PropertyDeclarationStructure>>(
      field => ({
        name: field.name,
        type: getFieldType(field),
        hasExclamationToken: !field.relationName && field.isRequired,
        hasQuestionToken: !!field.relationName || !field.isRequired,
        ...(field.documentation && {
          docs: [{ description: field.documentation }],
        }),
      }),
    ),
  });
}

function getFieldType(field: DMMF.Field) {
  let type: string;
  if (field.kind === "scalar") {
    type = mapScalarToType(field.type)!;
  } else {
    type = field.type;
  }
  if (field.isList) {
    type += "[]";
  }
  return type;
}

function mapScalarToType(scalar: string) {
  switch (scalar) {
    case "String": {
      return "string";
    }
    case "Boolean": {
      return "boolean";
    }
    case "DateTime": {
      return "Date";
    }
    case "Int":
    case "Float": {
      return "number";
    }
  }
}
