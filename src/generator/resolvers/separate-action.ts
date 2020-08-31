import { Project } from "ts-morph";
import path from "path";

import { resolversFolderName, crudResolversFolderName } from "../config";
import {
  generateTypeGraphQLImport,
  generateArgsImports,
  generateModelsImports,
  generateOutputsImports,
  generateGraphQLFieldsImport,
} from "../imports";
import { generateCrudResolverClassMethodDeclaration } from "./helpers";
import { DmmfDocument } from "../dmmf/dmmf-document";
import { DMMF } from "../dmmf/types";

export default function generateActionResolverClass(
  project: Project,
  baseDirPath: string,
  model: DMMF.Model,
  action: DMMF.Action,
  mapping: DMMF.Mapping,
  dmmfDocument: DmmfDocument,
) {
  const sourceFile = project.createSourceFile(
    path.resolve(
      baseDirPath,
      resolversFolderName,
      crudResolversFolderName,
      model.typeName,
      `${action.actionResolverName}.ts`,
    ),
    undefined,
    { overwrite: true },
  );

  generateTypeGraphQLImport(sourceFile);
  if (action.kind === DMMF.ModelAction.aggregate) {
    generateGraphQLFieldsImport(sourceFile);
  }
  if (action.argsTypeName) {
    generateArgsImports(sourceFile, [action.argsTypeName], 0);
  }
  generateModelsImports(
    sourceFile,
    [model.name, action.outputTypeName]
      .filter(typeName => dmmfDocument.isModelName(typeName))
      .map(typeName => dmmfDocument.getModelTypeName(typeName)!),
    3,
  );
  generateOutputsImports(
    sourceFile,
    [action.outputTypeName].filter(
      typeName => !dmmfDocument.isModelName(typeName),
    ),
    2,
  );

  sourceFile.addClass({
    name: action.actionResolverName,
    isExported: true,
    decorators: [
      {
        name: "TypeGraphQL.Resolver",
        arguments: [`_of => ${model.typeName}`],
      },
    ],
    methods: [
      generateCrudResolverClassMethodDeclaration(
        action,
        model.typeName,
        dmmfDocument,
        mapping,
      ),
    ],
  });
}
