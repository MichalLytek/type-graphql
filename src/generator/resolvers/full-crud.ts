import { OptionalKind, MethodDeclarationStructure, Project } from "ts-morph";
import path from "path";

import { camelCase } from "../helpers";
import { GeneratedResolverData } from "../types";
import {
  baseKeys,
  ModelKeys,
  supportedMutationActions,
  supportedQueryActions,
  resolversFolderName,
  crudResolversFolderName,
  argsFolderName,
} from "../config";
import generateArgsTypeClassFromArgs from "../args-class";
import {
  generateTypeGraphQLImport,
  generateArgsImports,
  generateModelsImports,
  generateOutputsImports,
  generateArgsBarrelFile,
} from "../imports";
import saveSourceFile from "../../utils/saveSourceFile";
import generateActionResolverClass from "./separate-action";
import { GenerateCodeOptions } from "../options";
import { generateCrudResolverClassMethodDeclaration } from "./helpers";
import { DmmfDocument } from "../dmmf/dmmf-document";
import { DMMF } from "../dmmf/types";

export default async function generateCrudResolverClassFromMapping(
  project: Project,
  baseDirPath: string,
  mapping: DMMF.Mapping,
  model: DMMF.Model,
  types: DMMF.OutputType[],
  modelNames: string[],
  options: GenerateCodeOptions,
  dmmfDocument: DmmfDocument,
): Promise<GeneratedResolverData> {
  const resolverName = `${model.typeName}CrudResolver`;
  const collectionName = camelCase(mapping.model);

  const resolverDirPath = path.resolve(
    baseDirPath,
    resolversFolderName,
    crudResolversFolderName,
    model.typeName,
  );
  const filePath = path.resolve(resolverDirPath, `${resolverName}.ts`);
  const sourceFile = project.createSourceFile(filePath, undefined, {
    overwrite: true,
  });

  generateTypeGraphQLImport(sourceFile);

  const actionNames = Object.keys(mapping).filter(
    key => !baseKeys.includes(key as any),
  ) as ModelKeys[];

  const supportedActionNames = actionNames.filter(
    actionName => getOperationKindName(actionName) !== undefined,
  );

  const methodsInfo = await Promise.all(
    supportedActionNames.map(async actionName => {
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
      const outputTypeName = method.outputType.type as string;

      let argsTypeName: string | undefined;
      if (method.args.length > 0) {
        argsTypeName = await generateArgsTypeClassFromArgs(
          project,
          resolverDirPath,
          method.args,
          `${actionName}${dmmfDocument.getModelTypeName(mapping.model)}`,
          dmmfDocument,
        );
      }

      return {
        operationKind,
        method,
        actionName,
        outputTypeName,
        argsTypeName,
      };
    }),
  );
  const argTypeNames = methodsInfo
    .filter(it => it.argsTypeName !== undefined)
    .map(it => it.argsTypeName!);

  if (argTypeNames.length) {
    const barrelExportSourceFile = project.createSourceFile(
      path.resolve(resolverDirPath, argsFolderName, "index.ts"),
      undefined,
      { overwrite: true },
    );
    generateArgsBarrelFile(
      barrelExportSourceFile,
      methodsInfo
        .filter(it => it.argsTypeName !== undefined)
        .map(it => it.argsTypeName!),
    );
    await saveSourceFile(barrelExportSourceFile);
  }

  generateArgsImports(sourceFile, argTypeNames, 0);

  const distinctOutputTypesNames = [
    ...new Set(methodsInfo.map(it => it.outputTypeName)),
  ];
  generateModelsImports(
    sourceFile,
    distinctOutputTypesNames
      .filter(typeName => modelNames.includes(typeName))
      .map(typeName =>
        dmmfDocument.isModelName(typeName)
          ? dmmfDocument.getModelTypeName(typeName)!
          : typeName,
      ),
    3,
  );
  generateOutputsImports(
    sourceFile,
    distinctOutputTypesNames
      .filter(typeName => !modelNames.includes(typeName))
      .map(typeName =>
        typeName.includes("Aggregate")
          ? `Aggregate${dmmfDocument.getModelTypeName(
              typeName.replace("Aggregate", ""),
            )}`
          : typeName,
      ),
    2,
  );

  sourceFile.addClass({
    name: resolverName,
    isExported: true,
    decorators: [
      {
        name: "TypeGraphQL.Resolver",
        arguments: [`_of => ${model.typeName}`],
      },
    ],
    methods: await Promise.all(
      methodsInfo.map<OptionalKind<MethodDeclarationStructure>>(
        ({ operationKind, actionName, method, argsTypeName }) =>
          generateCrudResolverClassMethodDeclaration(
            operationKind,
            actionName,
            model.typeName,
            method,
            argsTypeName,
            collectionName,
            dmmfDocument,
            mapping,
            options,
          ),
      ),
    ),
  });

  const actionResolverNames = await Promise.all(
    methodsInfo.map(
      ({ operationKind, actionName, method, outputTypeName, argsTypeName }) =>
        generateActionResolverClass(
          project,
          baseDirPath,
          model,
          operationKind,
          actionName,
          method,
          outputTypeName,
          argsTypeName,
          collectionName,
          modelNames,
          mapping,
          options,
          dmmfDocument,
        ),
    ),
  );

  await saveSourceFile(sourceFile);
  return {
    modelName: model.typeName,
    resolverName,
    actionResolverNames,
    argTypeNames,
  };
}

function getOperationKindName(actionName: string): string | undefined {
  if (supportedQueryActions.includes(actionName as any)) return "Query";
  if (supportedMutationActions.includes(actionName as any)) return "Mutation";
}
