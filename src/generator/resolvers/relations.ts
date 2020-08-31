import { OptionalKind, MethodDeclarationStructure, Project } from "ts-morph";
import path from "path";

import { camelCase } from "../helpers";
import { resolversFolderName, relationsResolversFolderName } from "../config";
import {
  generateTypeGraphQLImport,
  generateArgsImports,
  generateModelsImports,
} from "../imports";
import { DmmfDocument } from "../dmmf/dmmf-document";
import { DMMF } from "../dmmf/types";

export default function generateRelationsResolverClassesFromModel(
  project: Project,
  baseDirPath: string,
  dmmfDocument: DmmfDocument,
  { model, relationFields, resolverName }: DMMF.RelationModel,
) {
  const rootArgName = camelCase(model.typeName);
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
    model.typeName,
  );
  const filePath = path.resolve(resolverDirPath, `${resolverName}.ts`);
  const sourceFile = project.createSourceFile(filePath, undefined, {
    overwrite: true,
  });

  generateTypeGraphQLImport(sourceFile);
  generateModelsImports(
    sourceFile,
    [...relationFields.map(field => field.type), model.name].map(typeName =>
      dmmfDocument.isModelName(typeName)
        ? dmmfDocument.getModelTypeName(typeName)!
        : typeName,
    ),
    3,
  );

  const argTypeNames = relationFields
    .filter(it => it.argsTypeName !== undefined)
    .map(it => it.argsTypeName!);
  generateArgsImports(sourceFile, argTypeNames, 0);

  sourceFile.addClass({
    name: resolverName,
    isExported: true,
    decorators: [
      {
        name: "TypeGraphQL.Resolver",
        arguments: [`_of => ${model.typeName}`],
      },
    ],
    methods: relationFields.map<OptionalKind<MethodDeclarationStructure>>(
      field => {
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
            `Unexpected error happened on generating 'whereConditionString' for ${model.typeName} relation resolver`,
          );
        }
        return {
          name: field.typeFieldAlias ?? field.name,
          isAsync: true,
          returnType: `Promise<${field.fieldTSType}>`,
          decorators: [
            {
              name: "TypeGraphQL.FieldResolver",
              arguments: [
                `_type => ${field.typeGraphQLType}`,
                `{
                  nullable: ${!field.isRequired},
                  description: ${field.docs ? `"${field.docs}"` : "undefined"},
                }`,
              ],
            },
          ],
          parameters: [
            {
              name: rootArgName,
              type: model.typeName,
              decorators: [{ name: "TypeGraphQL.Root", arguments: [] }],
            },
            {
              name: "ctx",
              // TODO: import custom `ContextType`
              type: "any",
              decorators: [{ name: "TypeGraphQL.Ctx", arguments: [] }],
            },
            ...(!field.argsTypeName
              ? []
              : [
                  {
                    name: "args",
                    type: field.argsTypeName,
                    decorators: [{ name: "TypeGraphQL.Args", arguments: [] }],
                  },
                ]),
          ],
          // TODO: refactor to AST
          statements: [
            `return ctx.prisma.${camelCase(model.name)}.findOne({
              where: {${whereConditionString}},
            }).${field.name}(${field.argsTypeName ? "args" : "{}"});`,
          ],
        };
      },
    ),
  });
}
