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
import { ActionData, AuthChecker } from "../types";

export function createHandlerResolver(
  resolverMetadata: BaseResolverMetadata,
): GraphQLFieldResolver<any, any, any> {
  const targetInstance = IOCContainer.getInstance(resolverMetadata.target);
  const { validate: globalValidate, authChecker, pubSub } = BuildContext;

  return async (root, args, context, info) => {
    const actionData: ActionData = { root, args, context, info };
    return applyMiddlewares(resolverMetadata, actionData, authChecker, async () => {
      const params: any[] = await getParams(
        resolverMetadata.params!,
        actionData,
        globalValidate,
        pubSub,
      );
      return resolverMetadata.handler!.apply(targetInstance, params);
    });
  };
}

export function createAdvancedFieldResolver(
  fieldResolverMetadata: FieldResolverMetadata,
): GraphQLFieldResolver<any, any, any> {
  if (fieldResolverMetadata.kind === "external") {
    return createHandlerResolver(fieldResolverMetadata);
  }

  const targetType = fieldResolverMetadata.getParentType!();
  const { validate: globalValidate, authChecker, pubSub } = BuildContext;

  return async (root, args, context, info) => {
    const actionData: ActionData = { root, args, context, info };
    const targetInstance: any = convertToType(targetType, root);
    return applyMiddlewares(fieldResolverMetadata, actionData, authChecker, async () => {
      // method
      if (fieldResolverMetadata.handler) {
        const params: any[] = await getParams(
          fieldResolverMetadata.params!,
          actionData,
          globalValidate,
          pubSub,
        );
        return fieldResolverMetadata.handler.apply(targetInstance, params);
      }
      // getter
      return targetInstance[fieldResolverMetadata.methodName];
    });
  };
}

export function createSimpleFieldResolver(
  fieldMetadata: FieldMetadata,
): GraphQLFieldResolver<any, any, any> {
  const authChecker = BuildContext.authChecker;
  return async (root, args, context, info) => {
    const actionData: ActionData = { root, args, context, info };
    // TODO: handle simple field middlewares
    // return await applyMiddlewares(fieldMetadata, actionData, authChecker, () => {
      return root[fieldMetadata.name];
    // });
  };
}

async function applyMiddlewares(
  resolverMetadata: BaseResolverMetadata,
  actionData: ActionData,
  authChecker: AuthChecker<any> | undefined,
  resolverHandlerFunction: () => any,
) {
  await checkForAccess(actionData, authChecker, resolverMetadata.roles);
  for (const middleware of resolverMetadata.beforeMiddlewares!) {
    await middleware(actionData);
  }
  const result = await resolverHandlerFunction();
  for (const middleware of resolverMetadata.afterMiddlewares!) {
    await middleware(actionData, result);
  }
  return result;
}
