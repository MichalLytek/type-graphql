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
      ...(action.kind === "aggregate"
        ? []
        : [
            {
              name: "ctx",
              // TODO: import custom `ContextType`
              type: "any",
              decorators: [{ name: "TypeGraphQL.Ctx", arguments: [] }],
            },
          ]),
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
            // it will expose field resolvers automatically
            `return new ${returnTSType}();`,
          ]
        : [
            `return ctx.prisma.${collectionName}.${action.kind}(${
              argsTypeName ? "args" : ""
            });`,
          ],
  };
}
