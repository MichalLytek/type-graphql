import {
  SourceFile,
  OptionalKind,
  MethodDeclarationStructure,
  ParameterDeclarationStructure,
} from "ts-morph";
import { DMMF } from "@prisma/photon";
import pluralize from "pluralize";

import {
  getBaseModelTypeName,
  getFieldTSType,
  getTypeGraphQLType,
  camelCase,
  pascalCase,
  selectInputTypeFromTypes,
  mapSchemaArgToParameterDeclaration,
} from "./helpers";
import { DMMFTypeInfo } from "./types";

export default async function generateRelationsResolverClassesFromModel(
  sourceFile: SourceFile,
  model: DMMF.Model,
  outputType: DMMF.OutputType,
  modelNames: string[],
) {
  const relationFields = model.fields.filter(field => field.relationName);
  const idField = model.fields.find(field => field.isId)!;
  const rootArgName = camelCase(model.name);

  sourceFile.addClass({
    name: `${model.name}RelationsResolver`,
    isExported: true,
    decorators: [
      {
        name: "Resolver",
        arguments: [`_of => ${getBaseModelTypeName(model.name)}`],
      },
    ],
    methods: relationFields.map<OptionalKind<MethodDeclarationStructure>>(
      field => {
        const outputTypeField = outputType.fields.find(
          it => it.name === field.name,
        )!;
        const fieldDocs =
          field.documentation && field.documentation.replace("\r", "");
        const fieldType = getFieldTSType(field, modelNames);
        const [
          createDataLoaderFunctionName,
          dataLoaderInCtxName,
        ] = createDataLoaderCreationStatement(
          sourceFile,
          model.name,
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
            ...outputTypeField.args.map(arg =>
              mapSchemaArgToParameterDeclaration(arg, modelNames),
            ),
          ],
          statements: [
            `ctx.${dataLoaderInCtxName} = ctx.${dataLoaderInCtxName} || ${createDataLoaderFunctionName}(ctx.photon);
            return ctx.${dataLoaderInCtxName}.load(${rootArgName}.${idField.name});`,
          ],
        };
      },
    ),
  });
}

function createDataLoaderCreationStatement(
  sourceFile: SourceFile,
  modelName: string,
  relationFieldName: string,
  idFieldName: string,
  rootKeyType: string,
  fieldType: string,
) {
  // TODO: use `mappings`
  const dataLoaderInCtxName = `${camelCase(modelName)}${pascalCase(
    relationFieldName,
  )}Loader`;
  const functionName = `create${pascalCase(dataLoaderInCtxName)}`;
  const collectionName = pluralize(camelCase(modelName));

  sourceFile.addFunction({
    name: functionName,
    // TODO: import Photon type
    parameters: [{ name: "photon", type: "any" }],
    statements: [
      `return new DataLoader<${rootKeyType}, ${fieldType}>(async keys => {
        const fetchedData: any[] = await photon.${collectionName}.findMany({
          where: { ${idFieldName}: { in: keys } },
          select: { ${idFieldName}: true, ${relationFieldName}: true },
        });
        return keys
          .map(key => fetchedData.find(data => data.${idFieldName} === key)!)
          .map(data => data.${relationFieldName});
      });`,
    ],
  });
  return [functionName, dataLoaderInCtxName];
}
