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
  const rootArgName = camelCase(model.name);
  const relationFields = model.fields.filter(field => field.relationName);
  const uniqueFields =
    model.idFields.length > 0
      ? model.fields.filter(field => model.idFields.includes(field.name))
      : (model.uniqueFields as string[][]).length > 0
      ? model.fields.filter(field =>
          // taking first unique group is enough to fetch entity
          (model.uniqueFields as string[][])[0].includes(field.name),
        )
      : [
          model.fields.find(field => field.isId)! ??
            model.fields.find(field => field.isUnique)!,
        ].filter(Boolean);
  if (uniqueFields.length === 0) {
    throw new Error(`Unable to find unique fields for ${model.name}!`);
  }

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
            `return ctx.prisma.${camelCase(model.name)}.findOne({
              where: {
                ${uniqueFields
                  .map(field => `${field.name}: ${rootArgName}.${field.name},`)
                  .join("\n")}
              },
            }).${field.name}(${argsTypeName ? "args" : "{}"});`,
          ],
        };
      },
    ),
  });

  await saveSourceFile(sourceFile);
  return { modelName: model.name, resolverName, argTypeNames };
}
