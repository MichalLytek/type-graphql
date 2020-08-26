import { OptionalKind, MethodDeclarationStructure, Project } from "ts-morph";
import path from "path";

import { resolversFolderName, crudResolversFolderName } from "../config";
import {
  generateTypeGraphQLImport,
  generateArgsImports,
  generateModelsImports,
  generateOutputsImports,
  generateGraphQLFieldsImport,
} from "../imports";
import saveSourceFile from "../../utils/saveSourceFile";
import { generateCrudResolverClassMethodDeclaration } from "./helpers";
import { DmmfDocument } from "../dmmf/dmmf-document";
import { DMMF } from "../dmmf/types";

export default async function generateCrudResolverClassFromMapping(
  project: Project,
  baseDirPath: string,
  mapping: DMMF.Mapping,
  model: DMMF.Model,
  dmmfDocument: DmmfDocument,
) {
  const resolverDirPath = path.resolve(
    baseDirPath,
    resolversFolderName,
    crudResolversFolderName,
    model.typeName,
  );
  const filePath = path.resolve(resolverDirPath, `${mapping.resolverName}.ts`);
  const sourceFile = project.createSourceFile(filePath, undefined, {
    overwrite: true,
  });

  generateTypeGraphQLImport(sourceFile);
  generateGraphQLFieldsImport(sourceFile);
  generateArgsImports(
    sourceFile,
    mapping.actions
      .filter(it => it.argsTypeName !== undefined)
      .map(it => it.argsTypeName!),
    0,
  );

  const distinctOutputTypesNames = [
    ...new Set(mapping.actions.map(it => it.outputTypeName)),
  ];
  const modelOutputTypeNames = distinctOutputTypesNames
    .filter(typeName => dmmfDocument.isModelName(typeName))
    .map(typeName => dmmfDocument.getModelTypeName(typeName)!);
  const otherOutputTypeNames = distinctOutputTypesNames.filter(
    typeName => !dmmfDocument.isModelName(typeName),
  );
  generateModelsImports(sourceFile, modelOutputTypeNames, 3);
  generateOutputsImports(sourceFile, otherOutputTypeNames, 2);

  sourceFile.addClass({
    name: mapping.resolverName,
    isExported: true,
    decorators: [
      {
        name: "TypeGraphQL.Resolver",
        arguments: [`_of => ${model.typeName}`],
      },
    ],
    methods: mapping.actions.map<OptionalKind<MethodDeclarationStructure>>(
      action =>
        generateCrudResolverClassMethodDeclaration(
          action,
          model.typeName,
          dmmfDocument,
          mapping,
        ),
    ),
  });
  await saveSourceFile(sourceFile);
}
