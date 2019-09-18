import {
  SourceFile,
  PropertyDeclarationStructure,
  OptionalKind,
} from "ts-morph";
import { DMMF } from "@prisma/photon/dist/runtime/dmmf-types";
import {
  getBaseModelTypeName,
  getFieldTSType,
  getTypeGraphQLType,
} from "./helpers";

export default async function generateObjectTypeClassFromModel(
  sourceFile: SourceFile,
  model: DMMF.Model,
  modelNames: string[],
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
          type: getFieldTSType(field, modelNames),
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
                      `_type => ${getTypeGraphQLType(field, modelNames)}`,
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
