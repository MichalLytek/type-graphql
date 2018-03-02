import { GraphQLFieldResolver } from "graphql";

import { IOCContainer } from "../utils/container";
import { FieldResolverDefinition, FieldDefinition } from "../metadata/definition-interfaces";
import { getParams, checkForAccess } from "./helpers";
import { BaseResolverDefinitions } from "../types/resolvers";
import { convertToType } from "../types/helpers";
import { BuildContext } from "../schema/build-context";
import { AuthCheckerFunc, ActionData } from "../types/auth-checker";

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
  fieldResolverDefintion: FieldResolverDefinition,
): GraphQLFieldResolver<any, any, any> {
  if (fieldResolverDefintion.kind === "external") {
    return createHandlerResolver(fieldResolverDefintion);
  }

  const targetType = fieldResolverDefintion.getParentType!();
  const globalValidate = BuildContext.validate;
  const authChecker = BuildContext.authChecker;
  return async (root, args, context, info) => {
    const actionData: ActionData = { root, args, context, info };
    await checkForAccess(actionData, authChecker, fieldResolverDefintion.roles);
    const targetInstance: any = convertToType(targetType, root);
    // method
    if (fieldResolverDefintion.handler) {
      const params: any[] = await getParams(
        fieldResolverDefintion.params!,
        actionData,
        globalValidate,
      );
      return fieldResolverDefintion.handler.apply(targetInstance, params);
    }
    // getter
    return targetInstance[fieldResolverDefintion.methodName];
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
