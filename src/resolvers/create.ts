import { GraphQLFieldResolver } from "graphql";
import { plainToClass } from "class-transformer";

import { MetadataStorage } from "../metadata/metadata-storage";
import { IOCContainer } from "../container";
import {
  HandlerDefinition,
  FieldDefinition,
  FieldResolverDefinition,
  ParamDefinition,
} from "../metadata/definition-interfaces";
import { getParams } from "./helpers";

export function createResolver(
  handlerDefinition: HandlerDefinition,
): GraphQLFieldResolver<any, any, any> {
  const targetInstance = IOCContainer.getInstance(handlerDefinition.target);
  return (root, args, context, info) => {
    const params = getParams(handlerDefinition.params!, { root, args, context, info });
    return handlerDefinition.handler.apply(targetInstance, params);
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
    const targetInstance: any = plainToClass(targetType as any, root);
    // method
    if (fieldResolverDefintion.handler) {
      const params = getParams(fieldResolverDefintion.params!, { root, args, context, info });
      return fieldResolverDefintion.handler.apply(targetInstance, params);
    }
    // getter
    return targetInstance[fieldResolverDefintion.methodName];
  };
}
