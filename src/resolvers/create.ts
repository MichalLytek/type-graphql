import { GraphQLFieldResolver } from "graphql";

import { IOCContainer } from "../utils/container";
import {
  FieldResolverMetadata,
  FieldMetadata,
  BaseResolverMetadata,
} from "../metadata/definitions";
import { getParams, checkForAccess } from "./helpers";
import { convertToType } from "../helpers/types";
import { BuildContext } from "../schema/build-context";
import { ActionData } from "../types/auth-checker";

export function createHandlerResolver(
  resolverMetadata: BaseResolverMetadata,
): GraphQLFieldResolver<any, any, any> {
  const targetInstance = IOCContainer.getInstance(resolverMetadata.target);
  const globalValidate = BuildContext.validate;
  const authChecker = BuildContext.authChecker;

  return async (root, args, context, info) => {
    const actionData: ActionData = { root, args, context, info };
    await checkForAccess(actionData, authChecker, resolverMetadata.roles);
    const params: any[] = await getParams(resolverMetadata.params!, actionData, globalValidate);
    return resolverMetadata.handler!.apply(targetInstance, params);
  };
}

export function createAdvancedFieldResolver(
  fieldResolverMetadata: FieldResolverMetadata,
): GraphQLFieldResolver<any, any, any> {
  if (fieldResolverMetadata.kind === "external") {
    return createHandlerResolver(fieldResolverMetadata);
  }

  const targetType = fieldResolverMetadata.getParentType!();
  const globalValidate = BuildContext.validate;
  const authChecker = BuildContext.authChecker;
  return async (root, args, context, info) => {
    const actionData: ActionData = { root, args, context, info };
    await checkForAccess(actionData, authChecker, fieldResolverMetadata.roles);
    const targetInstance: any = convertToType(targetType, root);
    // method
    if (fieldResolverMetadata.handler) {
      const params: any[] = await getParams(
        fieldResolverMetadata.params!,
        actionData,
        globalValidate,
      );
      return fieldResolverMetadata.handler.apply(targetInstance, params);
    }
    // getter
    return targetInstance[fieldResolverMetadata.methodName];
  };
}

export function createSimpleFieldResolver(
  fieldMetadata: FieldMetadata,
): GraphQLFieldResolver<any, any, any> {
  const authChecker = BuildContext.authChecker;
  return async (root, args, context, info) => {
    const actionData: ActionData = { root, args, context, info };
    await checkForAccess(actionData, authChecker, fieldMetadata.roles);
    return root[fieldMetadata.name];
  };
}
