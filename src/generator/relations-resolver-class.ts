import { SourceFile, OptionalKind, MethodDeclarationStructure } from "ts-morph";
import { DMMF } from "@prisma/photon";
import pluralize from "pluralize";

import {
  getBaseModelTypeName,
  getFieldTSType,
  getTypeGraphQLType,
  camelCase,
  pascalCase,
  mapSchemaArgToParameterDeclaration,
} from "./helpers";

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
          createDataLoaderGetterFunctionName,
          dataLoaderGetterInCtxName,
        ] = createDataLoaderGetterCreationStatement(
          sourceFile,
          model.name,
          field.name,
          idField.name,
          getFieldTSType(idField, modelNames),
          fieldType,
        );
        const argNames = outputTypeField.args.map(arg => arg.name).join(", ");

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
            // TODO: replace with arg classes
            ...outputTypeField.args.map(arg =>
              mapSchemaArgToParameterDeclaration(arg, modelNames, true),
            ),
          ],
          // TODO: refactor to AST
          statements: [
            // TODO: replace with arg classes
            `const args = { ${argNames} };`,
            `ctx.${dataLoaderGetterInCtxName} = ctx.${dataLoaderGetterInCtxName} || ${createDataLoaderGetterFunctionName}(ctx.photon);`,
            `return ctx.${dataLoaderGetterInCtxName}(args).load(${rootArgName}.${idField.name});`,
          ],
        };
      },
    ),
  });
}

function createDataLoaderGetterCreationStatement(
  sourceFile: SourceFile,
  modelName: string,
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
  const collectionName = pluralize(camelCase(modelName));

  sourceFile.addFunction({
    name: functionName,
    parameters: [
      // TODO: import Photon type
      { name: "photon", type: "any" },
    ],
    statements: [
      // TODO: refactor to AST
      `const argsToDataLoaderMap = new Map<string, DataLoader<${rootKeyType}, ${fieldType}>>();
      return function ${dataLoaderGetterInCtxName}(args: any) {
        const argsJSON = JSON.stringify(args);
        let ${dataLoaderName} = argsToDataLoaderMap.get(argsJSON);
        if (!${dataLoaderName}) {
          ${dataLoaderName} = new DataLoader<${rootKeyType}, ${fieldType}>(async keys => {
            const fetchedData: any[] = await photon.${collectionName}.findMany({
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
      }
      `,
    ],
  });
  return [functionName, dataLoaderGetterInCtxName];
}
