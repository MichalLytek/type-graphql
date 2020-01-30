import { Project } from "ts-morph";
import { DMMF } from "@prisma/client/runtime";
import path from "path";

import { getFieldTSType, getTypeGraphQLType, pascalCase } from "./helpers";
import { DMMFTypeInfo } from "./types";
import { resolversFolderName, crudResolversFolderName } from "./config";
import {
  generateTypeGraphQLImports,
  generateArgsImports,
  generateModelsImports,
  generateOutputsImports,
} from "./imports";
import saveSourceFile from "../utils/saveSourceFile";

export default async function generateActionResolverClass(
  project: Project,
  baseDirPath: string,
  modelName: string,
  operationKind: string,
  actionName: string,
  method: DMMF.SchemaField,
  outputTypeName: string,
  argsTypeName: string | undefined,
  collectionName: string,
  modelNames: string[],
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

  const returnTSType = getFieldTSType(
    method.outputType as DMMFTypeInfo,
    modelNames,
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
    // TODO: refactor to a generic helper with crud resolvers
    methods: [
      {
        name: method.name,
        isAsync: true,
        returnType: `Promise<${returnTSType}>`,
        decorators: [
          {
            name: operationKind,
            arguments: [
              `_returns => ${getTypeGraphQLType(
                method.outputType as DMMFTypeInfo,
                modelNames,
              )}`,
              `{
                nullable: ${!method.outputType.isRequired},
                description: undefined
              }`,
            ],
          },
        ],
        parameters: [
          {
            name: "ctx",
            // TODO: import custom `ContextType`
            type: "any",
            decorators: [{ name: "Ctx", arguments: [] }],
          },
          ...(!argsTypeName
            ? []
            : [
                {
                  name: "args",
                  type: argsTypeName,
                  decorators: [{ name: "Args", arguments: [] }],
                },
              ]),
        ],
        statements: [
          `return ctx.prisma.${collectionName}.${actionName}(${
            argsTypeName ? "args" : ""
          });`,
        ],
      },
    ],
  });

  await saveSourceFile(sourceFile);
  return actionResolverName;
}
