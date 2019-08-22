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
  const modelDocs =
    model.documentation && model.documentation.replace("\r", "");

  sourceFile.addClass({
    name: getBaseModelTypeName(model.name),
    isExported: true,
    decorators: [
      {
        name: "ObjectType",
        arguments: [
          // `"${model.name}"`,
          // `"${getBaseModelTypeName(model.name)}"`,
          `{
            isAbstract: true,
            description: ${modelDocs ? `"${modelDocs}"` : "undefined"},
          }`,
        ],
      },
    ],
    properties: model.fields.map<OptionalKind<PropertyDeclarationStructure>>(
      field => {
        const isOptional = !!field.relationName || !field.isRequired;
        const fieldDocs =
          field.documentation && field.documentation.replace("\r", "");

        return {
          name: field.name,
          type: getFieldTSType(field),
          hasExclamationToken: !isOptional,
          hasQuestionToken: isOptional,
          trailingTrivia: "\r\n",
          decorators: [
            ...(field.relationName
              ? []
              : [
                  {
                    name: "Field",
                    arguments: [
                      `type => ${getTypeGraphQLType(field)}`,
                      `{
                        nullable: ${isOptional},
                        description: ${
                          fieldDocs ? `"${fieldDocs}"` : "undefined"
                        },
                      }`,
                    ],
                  },
                ]),
          ],
          ...(fieldDocs && {
            docs: [{ description: fieldDocs }],
          }),
        };
      },
    ),
    ...(modelDocs && {
      docs: [{ description: modelDocs }],
    }),
  });
}

function getBaseModelTypeName(modelName: string) {
  return `Base${modelName}`;
}

function getFieldTSType(field: DMMF.Field) {
  let type: string;
  if (field.kind === "scalar") {
    type = mapScalarToTSType(field.type);
  } else if (field.kind === "object") {
    type = getBaseModelTypeName(field.type);
  } else if (field.kind === "enum") {
    type = `keyof typeof ${field.type}`;
  } else {
    throw new Error(`Unsupported field type kind: ${field.kind}`);
  }
  if (field.isList) {
    type += "[]";
  }
  if (!field.isRequired) {
    type += " | null";
  }
  return type;
}

function mapScalarToTSType(scalar: string) {
  switch (scalar) {
    case "String": {
      return "string";
    }
    case "Boolean": {
      return "boolean";
    }
    case "DateTime": {
      // TODO: replace when Photon has been fixed
      // return "Date";
      return "string";
    }
    case "Int":
    case "Float": {
      return "number";
    }
    default:
      throw new Error(`Unrecognized scalar type: ${scalar}`);
  }
}

function getTypeGraphQLType(field: DMMF.Field) {
  let type: string;
  if (field.kind === "scalar") {
    type = mapScalarToTypeGraphQLType(field.type);
  } else if (field.kind === "object") {
    type = getBaseModelTypeName(field.type);
  } else {
    type = field.type;
  }
  if (field.isList) {
    type = `[${type}]`;
  }
  return type;
}

function mapScalarToTypeGraphQLType(scalar: string) {
  switch (scalar) {
    case "DateTime": {
      // TODO: replace when Photon has been fixed
      // return "Date";
      return "String";
    }
    case "Boolean":
    case "String":
    case "Int":
    case "Float": {
      return scalar;
    }
    default:
      throw new Error(`Unrecognized scalar type: ${scalar}`);
  }
}
