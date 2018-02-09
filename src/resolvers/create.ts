import { GraphQLFieldResolver } from "graphql";
import { IOCContainer } from "../utils/container";
import { FieldResolverDefinition } from "../metadata/definition-interfaces";
import { getParams } from "./helpers";
import { BaseResolverDefinitions } from "../types/resolvers";
import { convertToType } from "../types/helpers";
import { BuildContext } from "../schema/build-context";

export function createResolver(
  resolverDefinition: BaseResolverDefinitions,
): GraphQLFieldResolver<any, any, any> {
  const targetInstance = IOCContainer.getInstance(resolverDefinition.target);
  const globalValidate = BuildContext.validate;

  return async (root, args, context, info) => {
    const params: any[] = await getParams(
      resolverDefinition.params!,
      { root, args, context, info },
      globalValidate,
    );
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
  return async (root, args, context, info) => {
    const targetInstance: any = convertToType(targetType, root);
    const globalValidate = BuildContext.validate;

    // method
    if (fieldResolverDefintion.handler) {
      const params: any[] = await getParams(
        fieldResolverDefintion.params!,
        { root, args, context, info },
        globalValidate,
      );
      return fieldResolverDefintion.handler.apply(targetInstance, params);
    }
    // getter
    return targetInstance[fieldResolverDefintion.methodName];
  };
}
