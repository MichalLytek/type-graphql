import { OptionalKind, MethodDeclarationStructure, Project } from "ts-morph";
import path from "path";

import { camelCase, pascalCase } from "../helpers";
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
  generateGraphQLFieldsImport,
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
  generateGraphQLFieldsImport(sourceFile);

  const methodsInfo = await Promise.all(
    mapping.actions.map(async action => {
      const type = types.find(type =>
        type.fields.some(field => field.name === action.fieldName),
      );
      if (!type) {
        throw new Error(
          `Cannot find type with field ${action.fieldName} in root types definitions!`,
        );
      }
      const method = type.fields.find(field => field.name === action.fieldName);
      if (!method) {
        throw new Error(
          `Cannot find field ${action.fieldName} in output types definitions!`,
        );
      }
      const outputTypeName = method.outputType.type as string;

      let argsTypeName: string | undefined;
      if (method.args.length > 0) {
        argsTypeName = await generateArgsTypeClassFromArgs(
          project,
          resolverDirPath,
          method.args,
          `${pascalCase(
            `${action.kind}${dmmfDocument.getModelTypeName(mapping.model)}`,
          )}Args`,
          dmmfDocument,
        );
      }

      return {
        method,
        action,
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
    distinctOutputTypesNames.filter(typeName => !modelNames.includes(typeName)),
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
        ({ action, method, argsTypeName }) =>
          generateCrudResolverClassMethodDeclaration(
            action,
            model.typeName,
            method,
            argsTypeName,
            collectionName,
            dmmfDocument,
            mapping,
          ),
      ),
    ),
  });

  const actionResolverNames = await Promise.all(
    methodsInfo.map(({ action, method, outputTypeName, argsTypeName }) =>
      generateActionResolverClass(
        project,
        baseDirPath,
        model,
        action,
        method,
        outputTypeName,
        argsTypeName,
        collectionName,
        modelNames,
        mapping,
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
