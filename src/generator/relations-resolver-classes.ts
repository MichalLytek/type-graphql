import { SourceFile, OptionalKind, MethodDeclarationStructure } from "ts-morph";
import { DMMF } from "@prisma/photon/dist/runtime/dmmf-types";
import {
  getBaseModelTypeName,
  getFieldTSType,
  getTypeGraphQLType,
  toCamelCase,
} from "./helpers";

export default async function generateRelationsResolverClassesFromModel(
  sourceFile: SourceFile,
  model: DMMF.Model,
) {
  const relationFields = model.fields.filter(field => field.relationName);
  sourceFile.addClass({
    name: `${model.name}RelationsResolver`,
    isExported: true,
    decorators: [
      {
        name: "Resolver",
        arguments: [`of => ${getBaseModelTypeName(model.name)}`],
      },
    ],
    methods: relationFields.map<OptionalKind<MethodDeclarationStructure>>(
      field => {
        const fieldDocs =
          field.documentation && field.documentation.replace("\r", "");
        const rootArgName = toCamelCase(model.name);
        const idFieldName = model.fields.find(field => field.isId)!.name;
        return {
          name: field.name,
          isAsync: true,
          returnType: `Promise<${getFieldTSType(field)}>`,
          decorators: [
            {
              name: "FieldResolver",
              arguments: [
                `type => ${getTypeGraphQLType(field)}`,
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
              type: "any",
              decorators: [{ name: "Ctx", arguments: [] }],
            },
          ],
          statements: [
            createPhotonRelationResolverStatement(
              model.name,
              field.name,
              rootArgName,
              idFieldName,
            ),
          ],
        };
      },
    ),
  });
}

function createPhotonRelationResolverStatement(
  modelName: string,
  relationFieldName: string,
  rootArgName: string,
  idFieldName: string,
) {
  return `return ctx.photon.${toCamelCase(modelName)}s.findOne({
    where: { ${idFieldName}: ${rootArgName}.${idFieldName} }
  }).${relationFieldName}();`;
}
