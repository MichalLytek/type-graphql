import { DMMF } from "@prisma/client/runtime/dmmf-types";

import {
  getFieldTSType,
  getMappedActionName,
  getTypeGraphQLType,
} from "../helpers";
import { DMMFTypeInfo } from "../types";
import { GenerateCodeOptions } from "../options";
import { ModelKeys } from "../config";

export function generateCrudResolverClassMethodDeclaration(
  operationKind: string,
  actionName: ModelKeys,
  method: DMMF.SchemaField,
  argsTypeName: string | undefined,
  collectionName: string,
  modelNames: string[],
  mapping: DMMF.Mapping,
  options: GenerateCodeOptions,
) {
  const returnTSType = getFieldTSType(
    method.outputType as DMMFTypeInfo,
    modelNames,
  );

  return {
    name: options.useOriginalMapping
      ? method.name
      : getMappedActionName(actionName, method.name, mapping),
    isAsync: true,
    returnType: `Promise<${returnTSType}>`,
    decorators: [
      {
        name: operationKind,
        arguments: [
          `_returns => ${getTypeGraphQLType(
            method.outputType as DMMFTypeInfo,
            modelNames,
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
    statements: [
      `return ctx.prisma.${collectionName}.${actionName}(${
        argsTypeName ? "args" : ""
      });`,
    ],
  };
}
