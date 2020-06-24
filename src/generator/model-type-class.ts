import {
  PropertyDeclarationStructure,
  OptionalKind,
  Project,
  GetAccessorDeclarationStructure,
} from "ts-morph";
import path from "path";

import { cleanDocsString } from "./helpers";
import {
  generateTypeGraphQLImport,
  generateModelsImports,
  generateEnumsImports,
  generateGraphQLScalarImport,
  generatePrismaJsonTypeImport,
} from "./imports";
import { modelsFolderName } from "./config";
import saveSourceFile from "../utils/saveSourceFile";
import { DMMF } from "./dmmf/types";
import { DmmfDocument } from "./dmmf/dmmf-document";
import { GenerateCodeOptions } from "./options";

export default async function generateObjectTypeClassFromModel(
  project: Project,
  baseDirPath: string,
  model: DMMF.Model,
  dmmfDocument: DmmfDocument,
  options: GenerateCodeOptions,
) {
  const dirPath = path.resolve(baseDirPath, modelsFolderName);
  const filePath = path.resolve(dirPath, `${model.typeName}.ts`);
  const sourceFile = project.createSourceFile(filePath, undefined, {
    overwrite: true,
  });

  generateTypeGraphQLImport(sourceFile);
  generateGraphQLScalarImport(sourceFile);
  generatePrismaJsonTypeImport(sourceFile, options.relativePrismaOutputPath, 1);
  generateModelsImports(
    sourceFile,
    model.fields
      .filter(field => field.kind === "object")
      .filter(field => field.type !== model.name)
      .map(field =>
        dmmfDocument.isModelName(field.type)
          ? dmmfDocument.getModelTypeName(field.type)!
          : field.type,
      ),
  );
  generateEnumsImports(
    sourceFile,
    model.fields
      .filter(field => field.kind === "enum")
      .map(field => field.type),
  );

  const modelDocs = cleanDocsString(model.documentation);

  sourceFile.addClass({
    name: model.typeName,
    isExported: true,
    decorators: [
      {
        name: "TypeGraphQL.ObjectType",
        arguments: [
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
        const fieldDocs = cleanDocsString(field.documentation);

        return {
          name: field.name,
          type: field.fieldTSType,
          hasExclamationToken: !isOptional,
          hasQuestionToken: isOptional,
          trailingTrivia: "\r\n",
          decorators: [
            ...(field.relationName || field.typeFieldAlias
              ? []
              : [
                  {
                    name: "TypeGraphQL.Field",
                    arguments: [
                      `_type => ${field.typeGraphQLType}`,
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
    getAccessors: model.fields
      .filter(field => field.typeFieldAlias && !field.relationName)
      .map<OptionalKind<GetAccessorDeclarationStructure>>(field => {
        const fieldDocs = cleanDocsString(field.documentation);

        return {
          name: field.typeFieldAlias!,
          returnType: field.fieldTSType,
          trailingTrivia: "\r\n",
          decorators: [
            {
              name: "TypeGraphQL.Field",
              arguments: [
                `_type => ${field.typeGraphQLType}`,
                `{
                  nullable: ${!field.isRequired},
                  description: ${fieldDocs ? `"${fieldDocs}"` : "undefined"},
                }`,
              ],
            },
          ],
          statements: [`return this.${field.name};`],
          ...(fieldDocs && {
            docs: [{ description: fieldDocs }],
          }),
        };
      }),
    ...(modelDocs && {
      docs: [{ description: modelDocs }],
    }),
  });

  await saveSourceFile(sourceFile);
}
