import { getFieldTSType, getTypeGraphQLType } from "../helpers";
import { DmmfDocument } from "../dmmf/dmmf-document";
import { DMMF } from "../dmmf/types";

export function generateCrudResolverClassMethodDeclaration(
  action: DMMF.Action,
  typeName: string,
  method: DMMF.SchemaField,
  argsTypeName: string | undefined,
  collectionName: string,
  dmmfDocument: DmmfDocument,
  mapping: DMMF.Mapping,
) {
  const returnTSType = getFieldTSType(
    method.outputType,
    dmmfDocument,
    false,
    mapping.model,
    typeName,
  );

  return {
    name: action.name,
    isAsync: true,
    returnType: `Promise<${returnTSType}>`,
    decorators: [
      {
        name: `TypeGraphQL.${action.operation}`,
        arguments: [
          `_returns => ${getTypeGraphQLType(
            method.outputType,
            dmmfDocument,
            mapping.model,
            typeName,
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
        decorators: [{ name: "TypeGraphQL.Ctx", arguments: [] }],
      },
      ...(action.kind === "aggregate"
        ? [
            {
              name: "info",
              type: "GraphQLResolveInfo",
              decorators: [{ name: "TypeGraphQL.Info", arguments: [] }],
            },
          ]
        : []),
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
    statements:
      action.kind === "aggregate"
        ? [
            `function transformFields(fields: Record<string, any>): Record<string, any> {
              return Object.fromEntries(
                Object.entries(fields).map<[string, any]>(([key, value]) => {
                  if (Object.keys(value).length === 0) {
                    return [key, true];
                  }
                  return [key, transformFields(value)];
                })
              );
            }`,
            `return ctx.prisma.${collectionName}.${action.kind}({
              ...args,
              ...transformFields(graphqlFields(info as any)),
            });`,
          ]
        : [
            `return ctx.prisma.${collectionName}.${action.kind}(${
              argsTypeName ? "args" : ""
            });`,
          ],
  };
}
