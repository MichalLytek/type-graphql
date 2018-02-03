import { GraphQLFieldResolver } from "graphql";
import { plainToClass } from "class-transformer";

import { IOCContainer } from "../utils/container";
import { FieldResolverDefinition, ParamDefinition } from "../metadata/definition-interfaces";
import { getParams } from "./helpers";
import { BaseResolverDefinitions } from "../types/resolvers";

export function createResolver(
  resolverDefinition: BaseResolverDefinitions,
): GraphQLFieldResolver<any, any, any> {
  const targetInstance = IOCContainer.getInstance(resolverDefinition.target);
  return (root, args, context, info) => {
    const params = getParams(resolverDefinition.params!, { root, args, context, info });
    return resolverDefinition.handler!.apply(targetInstance, params);
  };
}

export function createFieldResolver(
  fieldResolverDefintion: FieldResolverDefinition,
): GraphQLFieldResolver<any, any, any> {
  if (fieldResolverDefintion.kind === "external") {
    return createResolver(fieldResolverDefintion);
  }

  const targetType = fieldResolverDefintion.getParentType!();
  return (root, args, context, info) => {
    // const targetData = { ...root }; // workaround for plainToClass bug
    // const targetInstance: any = plainToClass(targetType as any, targetData);
    const targetInstance: any = Object.assign({}, root);
    Object.setPrototypeOf(targetInstance, targetType.prototype);

    // method
    if (fieldResolverDefintion.handler) {
      const params = getParams(fieldResolverDefintion.params!, { root, args, context, info });
      return fieldResolverDefintion.handler.apply(targetInstance, params);
    }
    // getter
    return targetInstance[fieldResolverDefintion.methodName];
  };
}
