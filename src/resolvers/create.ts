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
import { Middleware } from "../interfaces";

export function createHandlerResolver(
  resolverMetadata: BaseResolverMetadata,
): GraphQLFieldResolver<any, any, any> {
  const targetInstance = IOCContainer.getInstance(resolverMetadata.target);
  const { validate: globalValidate, authChecker, pubSub } = BuildContext;

  return async (root, args, context, info) => {
    const actionData: ActionData<any> = { root, args, context, info };
    return applyMiddlewares(
      actionData,
      resolverMetadata.middlewares!,
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
  const { validate: globalValidate, authChecker, pubSub } = BuildContext;

  return async (root, args, context, info) => {
    const actionData: ActionData<any> = { root, args, context, info };
    const targetInstance: any = convertToType(targetType, root);
    return applyMiddlewares(
      actionData,
      fieldResolverMetadata.middlewares!,
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
  const authChecker = BuildContext.authChecker;
  return async (root, args, context, info) => {
    const actionData: ActionData<any> = { root, args, context, info };
    // TODO: handle simple field middlewares
    return await applyMiddlewares(actionData, [], authChecker, fieldMetadata.roles, () => {
      return root[fieldMetadata.name];
    });
  };
}

async function applyMiddlewares(
  actionData: ActionData<any>,
  middlewares: Array<Middleware<any>>,
  authChecker: AuthChecker<any> | undefined,
  roles: string[] | undefined,
  resolverHandlerFunction: () => any,
) {
  let middlewareIndex = -1;
  async function dispatchHandler(i: number): Promise<void> {
    if (i <= middlewareIndex) {
      throw new Error("next() called multiple times");
    }
    middlewareIndex = i;
    let handlerFn: Function;
    if (i === middlewares!.length) {
      handlerFn = resolverHandlerFunction;
    } else {
      handlerFn = middlewares![i];
    }
    if (!handlerFn) {
      return;
    }
    return await handlerFn(actionData, () => dispatchHandler(i + 1));
  }

  await checkForAccess(actionData, authChecker, roles);
  return dispatchHandler(0);
}
