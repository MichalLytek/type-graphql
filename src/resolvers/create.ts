import { GraphQLFieldResolver } from "graphql";

import { IOCContainer } from "../utils/container";
import {
  FieldResolverMetadata,
  FieldMetadata,
  BaseResolverMetadata,
} from "../metadata/definitions";
import { getParams, checkForAccess, applyMiddlewares } from "./helpers";
import { convertToType } from "../helpers/types";
import { BuildContext } from "../schema/build-context";
import { ActionData, AuthChecker } from "../types";
import { Middleware } from "../interfaces";

export function createHandlerResolver(
  resolverMetadata: BaseResolverMetadata,
): GraphQLFieldResolver<any, any, any> {
  const targetInstance = IOCContainer.getInstance(resolverMetadata.target);
  const { validate: globalValidate, authChecker, pubSub, globalMiddlewares } = BuildContext;
  const middlewares = globalMiddlewares.concat(resolverMetadata.middlewares!);

  return async (root, args, context, info) => {
    const actionData: ActionData<any> = { root, args, context, info };
    return applyMiddlewares(
      actionData,
      middlewares,
      authChecker,
      resolverMetadata.roles,
      async () => {
        const params: any[] = await getParams(
          resolverMetadata.params!,
          actionData,
          globalValidate,
          pubSub,
        );
        return resolverMetadata.handler!.apply(targetInstance, params);
      },
    );
  };
}

export function createAdvancedFieldResolver(
  fieldResolverMetadata: FieldResolverMetadata,
): GraphQLFieldResolver<any, any, any> {
  if (fieldResolverMetadata.kind === "external") {
    return createHandlerResolver(fieldResolverMetadata);
  }

  const targetType = fieldResolverMetadata.getParentType!();
  const { validate: globalValidate, authChecker, pubSub, globalMiddlewares } = BuildContext;
  const middlewares = globalMiddlewares.concat(fieldResolverMetadata.middlewares!);

  return async (root, args, context, info) => {
    const actionData: ActionData<any> = { root, args, context, info };
    const targetInstance: any = convertToType(targetType, root);
    return applyMiddlewares(
      actionData,
      middlewares,
      authChecker,
      fieldResolverMetadata.roles,
      async () => {
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
      },
    );
  };
}

export function createSimpleFieldResolver(
  fieldMetadata: FieldMetadata,
): GraphQLFieldResolver<any, any, any> {
  const { authChecker, globalMiddlewares } = BuildContext;
  const middlewares = globalMiddlewares.concat(fieldMetadata.middlewares!);
  return async (root, args, context, info) => {
    const actionData: ActionData<any> = { root, args, context, info };
    return await applyMiddlewares(
      actionData,
      middlewares,
      authChecker,
      fieldMetadata.roles,
      () => root[fieldMetadata.name],
    );
  };
}
