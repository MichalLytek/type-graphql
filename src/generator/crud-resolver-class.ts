import { OptionalKind, MethodDeclarationStructure, Project } from "ts-morph";
import { DMMF } from "@prisma/photon";
import path from "path";

import {
  getBaseModelTypeName,
  getFieldTSType,
  getTypeGraphQLType,
  selectInputTypeFromTypes,
} from "./helpers";
import { DMMFTypeInfo } from "./types";
import {
  baseKeys,
  ModelKeys,
  supportedMutations as supportedMutationActions,
  supportedQueries as supportedQueryActions,
  resolversFolderName,
} from "./config";
import generateArgsTypeClassFromArgs from "./args-class";
import {
  generateTypeGraphQLImports,
  generateArgsImports,
  generateModelsImports,
  generateOutputsImports,
} from "./imports";

export default async function generateCrudResolverClassFromMapping(
  project: Project,
  baseDirPath: string,
  mapping: DMMF.Mapping,
  types: DMMF.OutputType[],
  modelNames: string[],
) {
  const modelName = getBaseModelTypeName(mapping.model);
  const resolverName = `${modelName}CrudResolver`;

  const resolverDirPath = path.resolve(baseDirPath, resolversFolderName);
  const filePath = path.resolve(resolverDirPath, `${resolverName}.ts`);
  const sourceFile = project.createSourceFile(filePath, undefined, {
    overwrite: true,
  });

  generateTypeGraphQLImports(sourceFile);

  const actionNames = Object.keys(mapping).filter(
    key => !baseKeys.includes(key as any),
  ) as ModelKeys[];
  const importTypesNames: string[] = [];

  sourceFile.addClass({
    name: resolverName,
    isExported: true,
    decorators: [
      {
        name: "Resolver",
        arguments: [`_of => ${modelName}`],
      },
    ],
    methods: await Promise.all(
      actionNames
        .filter(actionName => getOperationKindName(actionName) !== undefined)
        .map<Promise<OptionalKind<MethodDeclarationStructure>>>(
          async actionName => {
            const operationKind = getOperationKindName(actionName)!;
            const fieldName = mapping[actionName];
            const type = types.find(type =>
              type.fields.some(field => field.name === fieldName),
            );
            if (!type) {
              throw new Error(
                `Cannot find type with field ${fieldName} in root types definitions!`,
              );
            }
            const method = type.fields.find(field => field.name === fieldName);
            if (!method) {
              throw new Error(
                `Cannot find field ${fieldName} in output types definitions!`,
              );
            }
            importTypesNames.push(method.outputType.type as string);

            const returnTSType = getFieldTSType(
              method.outputType as DMMFTypeInfo,
              modelNames,
            );
            let argsTypeName: string | undefined;
            if (method.args.length > 0) {
              argsTypeName = await generateArgsTypeClassFromArgs(
                project,
                resolverDirPath,
                method.args,
                method.name,
                modelNames,
              );
              generateArgsImports(sourceFile, [argsTypeName], 0);
            }

            return {
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
                `return ctx.photon.${mapping.plural}.${actionName}(${
                  argsTypeName ? "args" : ""
                });`,
              ],
            };
          },
        ),
    ),
  });

  const distinctImportTypesNames = [...new Set(importTypesNames)];

  generateModelsImports(
    sourceFile,
    distinctImportTypesNames.filter(typeName => modelNames.includes(typeName)),
  );
  generateOutputsImports(
    sourceFile,
    distinctImportTypesNames.filter(typeName => !modelNames.includes(typeName)),
    0,
  );

  // FIXME: use generic save source file utils
  sourceFile.formatText({ indentSize: 2 });
  await sourceFile.save();
}

function getOperationKindName(actionName: string): string | undefined {
  if (supportedQueryActions.includes(actionName as any)) return "Query";
  if (supportedMutationActions.includes(actionName as any)) return "Mutation";
}
