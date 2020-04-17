import { OptionalKind, MethodDeclarationStructure, Project } from "ts-morph";
import { DMMF } from "@prisma/client/runtime/dmmf-types";
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
  generateTypeGraphQLImport,
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
  const singleIdField = model.fields.find(field => field.isId);
  const singleUniqueField = model.fields.find(field => field.isUnique);
  const singleFilterField = singleIdField ?? singleUniqueField;
  const compositeIdFields = model.fields.filter(field =>
    model.idFields.includes(field.name),
  );
  const compositeUniqueFields = model.fields.filter(field =>
    // taking first unique group is enough to fetch entity
    model.uniqueFields[0]?.includes(field.name),
  );
  const compositeFilterFields =
    compositeIdFields.length > 0 ? compositeIdFields : compositeUniqueFields;

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
      // FIXME: remove when issue fixed: https://github.com/prisma/prisma2/issues/1987
      const fieldDocs = undefined as string | undefined;
      // const fieldDocs =
      //   field.documentation && field.documentation.replace("\r", "");
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

  generateTypeGraphQLImport(sourceFile);
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
        name: "TypeGraphQL.Resolver",
        arguments: [`_of => ${getBaseModelTypeName(model.name)}`],
      },
    ],
    methods: methodsInfo.map<OptionalKind<MethodDeclarationStructure>>(
      ({ field, fieldType, fieldDocs, argsTypeName }) => {
        let whereConditionString: string = "";
        // TODO: refactor to AST
        if (singleFilterField) {
          whereConditionString = `
            ${singleFilterField.name}: ${rootArgName}.${singleFilterField.name},
          `;
        } else if (compositeFilterFields.length > 0) {
          whereConditionString = `
            ${compositeFilterFields.map(it => it.name).join("_")}: {
              ${compositeFilterFields
                .map(
                  idField => `${idField.name}: ${rootArgName}.${idField.name},`,
                )
                .join("\n")}
            },
          `;
        } else {
          throw new Error(
            `Unexpected error happened on generating 'whereConditionString' for ${model.name} relation resolver`,
          );
        }
        return {
          name: field.name,
          isAsync: true,
          returnType: `Promise<${fieldType}>`,
          decorators: [
            {
              name: "TypeGraphQL.FieldResolver",
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
              decorators: [{ name: "TypeGraphQL.Root", arguments: [] }],
            },
            {
              name: "ctx",
              // TODO: import custom `ContextType`
              type: "any",
              decorators: [{ name: "TypeGraphQL.Ctx", arguments: [] }],
            },
            ...(!argsTypeName
              ? []
              : [
                  {
                    name: "args",
                    type: argsTypeName,
                    decorators: [{ name: "TypeGraphQL.Args", arguments: [] }],
                  },
                ]),
          ],
          // TODO: refactor to AST
          statements: [
            `return ctx.prisma.${camelCase(model.name)}.findOne({
              where: {${whereConditionString}},
            }).${field.name}(${argsTypeName ? "args" : "{}"});`,
          ],
        };
      },
    ),
  });

  await saveSourceFile(sourceFile);
  return { modelName: model.name, resolverName, argTypeNames };
}
