import { PropertyDeclarationStructure, OptionalKind, Project } from "ts-morph";
import { DMMF } from "@prisma/client/runtime/dmmf-types";
import path from "path";

import {
  getBaseModelTypeName,
  getFieldTSType,
  getTypeGraphQLType,
} from "./helpers";
import {
  generateTypeGraphQLImports,
  generateModelsImports,
  generateEnumsImports,
} from "./imports";
import { modelsFolderName } from "./config";
import saveSourceFile from "../utils/saveSourceFile";

export default async function generateObjectTypeClassFromModel(
  project: Project,
  baseDirPath: string,
  model: DMMF.Model,
  modelNames: string[],
) {
  const dirPath = path.resolve(baseDirPath, modelsFolderName);
  const filePath = path.resolve(dirPath, `${model.name}.ts`);
  const sourceFile = project.createSourceFile(filePath, undefined, {
    overwrite: true,
  });

  generateTypeGraphQLImports(sourceFile);
  generateModelsImports(
    sourceFile,
    model.fields
      .filter(field => field.kind === "object")
      .filter(field => field.type !== model.name)
      .map(field => field.type),
  );
  generateEnumsImports(
    sourceFile,
    model.fields
      .filter(field => field.kind === "enum")
      .map(field => field.type),
  );

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

  await saveSourceFile(sourceFile);
}
