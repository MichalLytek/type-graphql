import {
  OptionalKind,
  MethodDeclarationStructure,
  Project,
  SourceFile,
} from "ts-morph";
import { DMMF } from "@prisma/client/runtime";
import path from "path";

import {
  getBaseModelTypeName,
  getFieldTSType,
  getTypeGraphQLType,
  camelCase,
  pascalCase,
} from "../helpers";
import generateArgsTypeClassFromArgs from "../args-class";
import {
  resolversFolderName,
  relationsResolversFolderName,
  argsFolderName,
} from "../config";
import {
  generateTypeGraphQLImports,
  generateArgsImports,
  generateDataloaderImport,
  generateModelsImports,
  generateArgsBarrelFile,
} from "../imports";
import { GeneratedResolverData } from "../types";
import saveSourceFile from "../../utils/saveSourceFile";

export default async function generateRelationsResolverClassesFromModel(
  project: Project,
  baseDirPath: string,
  model: DMMF.Model,
  mapping: DMMF.Mapping,
  outputType: DMMF.OutputType,
  modelNames: string[],
): Promise<GeneratedResolverData> {
  const resolverName = `${model.name}RelationsResolver`;
  const relationFields = model.fields.filter(field => field.relationName);
  const idField = model.fields.find(field => field.isId)!;
  const rootArgName = camelCase(model.name);

  const resolverDirPath = path.resolve(
    baseDirPath,
    resolversFolderName,
    relationsResolversFolderName,
    model.name,
  );
  const filePath = path.resolve(resolverDirPath, `${resolverName}.ts`);
  const sourceFile = project.createSourceFile(filePath, undefined, {
    overwrite: true,
  });

  const methodsInfo = await Promise.all(
    relationFields.map(async field => {
      const outputTypeField = outputType.fields.find(
        it => it.name === field.name,
      )!;
      const fieldDocs =
        field.documentation && field.documentation.replace("\r", "");
      const fieldType = getFieldTSType(field, modelNames);

      let argsTypeName: string | undefined;
      if (outputTypeField.args.length > 0) {
        argsTypeName = await generateArgsTypeClassFromArgs(
          project,
          resolverDirPath,
          outputTypeField.args,
          model.name + pascalCase(field.name),
          modelNames,
        );
      }
      return { field, fieldDocs, fieldType, argsTypeName };
    }),
  );
  const argTypeNames = methodsInfo
    .filter(it => it.argsTypeName !== undefined)
    .map(it => it.argsTypeName!);

  const barrelExportSourceFile = project.createSourceFile(
    path.resolve(resolverDirPath, argsFolderName, "index.ts"),
    undefined,
    { overwrite: true },
  );
  if (argTypeNames.length) {
    generateArgsBarrelFile(barrelExportSourceFile, argTypeNames);
    await saveSourceFile(barrelExportSourceFile);
  }

  generateTypeGraphQLImports(sourceFile);
  generateDataloaderImport(sourceFile);
  generateModelsImports(
    sourceFile,
    [...relationFields.map(field => field.type), model.name],
    3,
  );
  generateArgsImports(sourceFile, argTypeNames, 0);

  sourceFile.addClass({
    name: resolverName,
    isExported: true,
    decorators: [
      {
        name: "Resolver",
        arguments: [`_of => ${getBaseModelTypeName(model.name)}`],
      },
    ],
    methods: methodsInfo.map<OptionalKind<MethodDeclarationStructure>>(
      ({ field, fieldType, fieldDocs, argsTypeName }) => {
        const [
          createDataLoaderGetterFunctionName,
          dataLoaderGetterInCtxName,
        ] = createDataLoaderGetterCreationStatement(
          sourceFile,
          model.name,
          camelCase(model.name),
          field.name,
          idField.name,
          getFieldTSType(idField, modelNames),
          fieldType,
        );

        return {
          name: field.name,
          isAsync: true,
          returnType: `Promise<${fieldType}>`,
          decorators: [
            {
              name: "FieldResolver",
              arguments: [
                `_type => ${getTypeGraphQLType(field, modelNames)}`,
                `{
                  nullable: ${!field.isRequired},
                  description: ${fieldDocs ? `"${fieldDocs}"` : "undefined"},
                }`,
              ],
            },
          ],
          parameters: [
            {
              name: rootArgName,
              type: `${getBaseModelTypeName(model.name)}`,
              decorators: [{ name: "Root", arguments: [] }],
            },
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
          // TODO: refactor to AST
          statements: [
            `ctx.${dataLoaderGetterInCtxName} = ctx.${dataLoaderGetterInCtxName} || ${createDataLoaderGetterFunctionName}(ctx.prisma);`,
            `return ctx.${dataLoaderGetterInCtxName}(${
              argsTypeName ? "args" : "{}"
            }).load(${rootArgName}.${idField.name});`,
          ],
        };
      },
    ),
  });

  await saveSourceFile(sourceFile);
  return { modelName: model.name, resolverName, argTypeNames };
}

function createDataLoaderGetterCreationStatement(
  sourceFile: SourceFile,
  modelName: string,
  collectionName: string,
  relationFieldName: string,
  idFieldName: string,
  rootKeyType: string,
  fieldType: string,
) {
  // TODO: use `mappings`
  const dataLoaderName = `${camelCase(modelName)}${pascalCase(
    relationFieldName,
  )}DataLoader`;
  const dataLoaderGetterInCtxName = `get${pascalCase(dataLoaderName)}`;
  const functionName = `create${pascalCase(dataLoaderGetterInCtxName)}`;

  sourceFile.addFunction({
    name: functionName,
    parameters: [
      // TODO: import PrismaClient type
      { name: "prisma", type: "any" },
    ],
    statements: [
      // TODO: refactor to AST
      `const argsToDataLoaderMap = new Map<string, DataLoader<${rootKeyType}, ${fieldType}>>();
      return function ${dataLoaderGetterInCtxName}(args: any) {
        const argsJSON = JSON.stringify(args);
        let ${dataLoaderName} = argsToDataLoaderMap.get(argsJSON);
        if (!${dataLoaderName}) {
          ${dataLoaderName} = new DataLoader<${rootKeyType}, ${fieldType}>(async keys => {
            const fetchedData: any[] = await prisma.${collectionName}.findMany({
              where: { ${idFieldName}: { in: keys } },
              select: {
                ${idFieldName}: true,
                ${relationFieldName}: args,
              },
            });
            return keys
              .map(key => fetchedData.find(data => data.${idFieldName} === key)!)
              .map(data => data.${relationFieldName});
          });
          argsToDataLoaderMap.set(argsJSON, ${dataLoaderName});
        }
        return ${dataLoaderName};
      }`,
    ],
  });
  return [functionName, dataLoaderGetterInCtxName];
}
