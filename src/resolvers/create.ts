import { GraphQLFieldResolver } from "graphql";

import { IOCContainer } from "../utils/container";
import { FieldResolverDefinition, FieldDefinition } from "../metadata/definition-interfaces";
import { getParams, checkForAccess } from "./helpers";
import { BaseResolverDefinitions } from "../types/resolvers";
import { convertToType } from "../types/helpers";
import { BuildContext } from "../schema/build-context";
import { ActionData } from "../types/auth-checker";

export function createHandlerResolver(
  resolverDefinition: BaseResolverDefinitions,
): GraphQLFieldResolver<any, any, any> {
  const targetInstance = IOCContainer.getInstance(resolverDefinition.target);
  const globalValidate = BuildContext.validate;
  const authChecker = BuildContext.authChecker;

  return async (root, args, context, info) => {
    const actionData: ActionData = { root, args, context, info };
    await checkForAccess(actionData, authChecker, resolverDefinition.roles);
    const params: any[] = await getParams(resolverDefinition.params!, actionData, globalValidate);
    return resolverDefinition.handler!.apply(targetInstance, params);
  };
}

export function createAdvancedFieldResolver(
  fieldResolverDefinition: FieldResolverDefinition,
): GraphQLFieldResolver<any, any, any> {
  if (fieldResolverDefinition.kind === "external") {
    return createHandlerResolver(fieldResolverDefinition);
  }

  const targetType = fieldResolverDefinition.getParentType!();
  const globalValidate = BuildContext.validate;
  const authChecker = BuildContext.authChecker;
  return async (root, args, context, info) => {
    const actionData: ActionData = { root, args, context, info };
    await checkForAccess(actionData, authChecker, fieldResolverDefinition.roles);
    const targetInstance: any = convertToType(targetType, root);
    // method
    if (fieldResolverDefinition.handler) {
      const params: any[] = await getParams(
        fieldResolverDefinition.params!,
        actionData,
        globalValidate,
      );
      return fieldResolverDefinition.handler.apply(targetInstance, params);
    }
    // getter
    return targetInstance[fieldResolverDefinition.methodName];
  };
}

export function createSimpleFieldResolver(
  fieldDefinition: FieldDefinition,
): GraphQLFieldResolver<any, any, any> {
  const authChecker = BuildContext.authChecker;
  return async (root, args, context, info) => {
    const actionData: ActionData = { root, args, context, info };
    await checkForAccess(actionData, authChecker, fieldDefinition.roles);
    return root[fieldDefinition.name];
  };
}
