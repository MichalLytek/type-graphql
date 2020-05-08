import { DMMF } from "@prisma/client/runtime/dmmf-types";

import {
  getFieldTSType,
  getMappedActionName,
  getTypeGraphQLType,
} from "../helpers";
import { DMMFTypeInfo } from "../types";
import { GenerateCodeOptions } from "../options";
import { ModelKeys } from "../config";
import { DmmfDocument } from "../dmmf/dmmf-document";

export function generateCrudResolverClassMethodDeclaration(
  operationKind: string,
  actionName: ModelKeys,
  typeName: string,
  method: DMMF.SchemaField,
  argsTypeName: string | undefined,
  collectionName: string,
  dmmfDocument: DmmfDocument,
  mapping: DMMF.Mapping,
  options: GenerateCodeOptions,
) {
  const returnTSType = getFieldTSType(
    method.outputType as DMMFTypeInfo,
    dmmfDocument,
    mapping.model,
    typeName,
  );

  return {
    name: options.useOriginalMapping
      ? `${actionName}${typeName}`
      : getMappedActionName(actionName, typeName),
    isAsync: true,
    returnType: `Promise<${returnTSType}>`,
    decorators: [
      {
        name: `TypeGraphQL.${operationKind}`,
        arguments: [
          `_returns => ${getTypeGraphQLType(
            method.outputType as DMMFTypeInfo,
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
      ...(actionName === "aggregate"
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
      actionName === "aggregate"
        ? [
            // it will expose field resolvers automatically
            `return new ${returnTSType}();`,
          ]
        : [
            `return ctx.prisma.${collectionName}.${actionName}(${
              argsTypeName ? "args" : ""
            });`,
          ],
  };
}
