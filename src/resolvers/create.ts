import { GraphQLFieldResolver } from "graphql";
import { IOCContainer } from "../utils/container";
import { FieldResolverDefinition } from "../metadata/definition-interfaces";
import { getParams } from "./helpers";
import { BaseResolverDefinitions } from "../types/resolvers";
import { convertToType } from "../types/convert";

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
    const targetInstance: any = convertToType(targetType, root);

    // method
    if (fieldResolverDefintion.handler) {
      const params = getParams(fieldResolverDefintion.params!, { root, args, context, info });
      return fieldResolverDefintion.handler.apply(targetInstance, params);
    }
    // getter
    return targetInstance[fieldResolverDefintion.methodName];
  };
}
