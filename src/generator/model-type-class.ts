import {
  PropertyDeclarationStructure,
  OptionalKind,
  Project,
  MethodDeclarationStructure,
  GetAccessorDeclarationStructure,
} from "ts-morph";
import path from "path";

import { getFieldTSType, getTypeGraphQLType } from "./helpers";
import {
  generateTypeGraphQLImport,
  generateModelsImports,
  generateEnumsImports,
  generateGraphQLScalarImport,
} from "./imports";
import { modelsFolderName } from "./config";
import saveSourceFile from "../utils/saveSourceFile";
import { DMMF } from "./dmmf/types";
import { DmmfDocument } from "./dmmf/dmmf-document";

export default async function generateObjectTypeClassFromModel(
  project: Project,
  baseDirPath: string,
  model: DMMF.Model,
  dmmfDocument: DmmfDocument,
) {
  const dirPath = path.resolve(baseDirPath, modelsFolderName);
  const filePath = path.resolve(dirPath, `${model.typeName}.ts`);
  const sourceFile = project.createSourceFile(filePath, undefined, {
    overwrite: true,
  });

  generateTypeGraphQLImport(sourceFile);
  generateGraphQLScalarImport(sourceFile);
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

  // FIXME: restore when issue fixed: https://github.com/prisma/prisma2/issues/1987
  const modelDocs = undefined as string | undefined;
  // const modelDocs =
  //   model.documentation && model.documentation.replace("\r", "");

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
        // FIXME: restore when issue fixed: https://github.com/prisma/prisma2/issues/1987
        const fieldDocs = undefined as string | undefined;
        // const fieldDocs =
        //   field.documentation && field.documentation.replace("\r", "");

        return {
          name: field.name,
          type: getFieldTSType(field, dmmfDocument),
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
                      `_type => ${getTypeGraphQLType(field, dmmfDocument)}`,
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
      .filter(field => field.typeFieldAlias)
      .map<OptionalKind<GetAccessorDeclarationStructure>>(field => {
        const isOptional = !!field.relationName || !field.isRequired;
        // FIXME: restore when issue fixed: https://github.com/prisma/prisma2/issues/1987
        const fieldDocs = undefined as string | undefined;
        // const fieldDocs =
        //   field.documentation && field.documentation.replace("\r", "");

        return {
          name: field.typeFieldAlias!,
          returnType: getFieldTSType(field, dmmfDocument),
          hasExclamationToken: !isOptional,
          hasQuestionToken: isOptional,
          trailingTrivia: "\r\n",
          decorators: [
            ...(field.relationName
              ? []
              : [
                  {
                    name: "TypeGraphQL.Field",
                    arguments: [
                      `_type => ${getTypeGraphQLType(field, dmmfDocument)}`,
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
