import { Project } from "ts-morph";
import { DMMF } from "@prisma/client/runtime";
import path from "path";

import { pascalCase } from "../helpers";
import {
  resolversFolderName,
  crudResolversFolderName,
  ModelKeys,
} from "../config";
import {
  generateTypeGraphQLImports,
  generateArgsImports,
  generateModelsImports,
  generateOutputsImports,
} from "../imports";
import saveSourceFile from "../../utils/saveSourceFile";
import { GenerateCodeOptions } from "../options";
import { generateCrudResolverClassMethodDeclaration } from "./helpers";

export default async function generateActionResolverClass(
  project: Project,
  baseDirPath: string,
  modelName: string,
  operationKind: string,
  actionName: ModelKeys,
  method: DMMF.SchemaField,
  outputTypeName: string,
  argsTypeName: string | undefined,
  collectionName: string,
  modelNames: string[],
  mapping: DMMF.Mapping,
  options: GenerateCodeOptions,
): Promise<string> {
  const actionResolverName = `${pascalCase(method.name)}Resolver`;
  const resolverDirPath = path.resolve(
    baseDirPath,
    resolversFolderName,
    crudResolversFolderName,
    modelName,
  );
  const filePath = path.resolve(resolverDirPath, `${actionResolverName}.ts`);
  const sourceFile = project.createSourceFile(filePath, undefined, {
    overwrite: true,
  });

  generateTypeGraphQLImports(sourceFile);
  if (argsTypeName) {
    generateArgsImports(sourceFile, [argsTypeName], 0);
  }
  generateModelsImports(
    sourceFile,
    [modelName, outputTypeName].filter(name => modelNames.includes(name)),
    3,
  );
  generateOutputsImports(
    sourceFile,
    [outputTypeName].filter(name => !modelNames.includes(name)),
    2,
  );

  sourceFile.addClass({
    name: actionResolverName,
    isExported: true,
    decorators: [
      {
        name: "Resolver",
        arguments: [`_of => ${modelName}`],
      },
    ],
    methods: [
      generateCrudResolverClassMethodDeclaration(
        operationKind,
        actionName,
        method,
        argsTypeName,
        collectionName,
        modelNames,
        mapping,
        options,
      ),
    ],
  });

  await saveSourceFile(sourceFile);
  return actionResolverName;
}
