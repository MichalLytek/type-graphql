import { GraphQLFieldResolver } from "graphql";

import {
  FieldResolverMetadata,
  FieldMetadata,
  BaseResolverMetadata,
} from "../metadata/definitions";
import { getParams, applyMiddlewares, applyAuthChecker } from "./helpers";
import { convertToType } from "../helpers/types";
import { BuildContext } from "../schema/build-context";
import { ResolverData } from "../interfaces";

export function createHandlerResolver(
  resolverMetadata: BaseResolverMetadata,
): GraphQLFieldResolver<any, any, any> {
  const {
    validate: globalValidate,
    authChecker,
    authMode,
    pubSub,
    globalMiddlewares,
    container,
    resolverBuilder,
  } = BuildContext;
  if (!resolverBuilder) {
    const middlewares = globalMiddlewares.concat(resolverMetadata.middlewares!);
    applyAuthChecker(middlewares, authMode, authChecker, resolverMetadata.roles);

    return async (root, args, context, info) => {
      const resolverData: ResolverData<any> = { root, args, context, info };
      const targetInstance = container.getInstance(resolverMetadata.target, resolverData);
      return applyMiddlewares(container, resolverData, middlewares, async () => {
        const params: any[] = await getParams(
          resolverMetadata.params!,
          resolverData,
          globalValidate,
          pubSub,
        );
        return targetInstance[resolverMetadata.methodName].apply(targetInstance, params);
      });
    };
  } else {
    return resolverBuilder(resolverMetadata);
  }
}

export function createAdvancedFieldResolver(
  fieldResolverMetadata: FieldResolverMetadata,
): GraphQLFieldResolver<any, any, any> {
  if (fieldResolverMetadata.kind === "external") {
    return createHandlerResolver(fieldResolverMetadata);
  }

  const targetType = fieldResolverMetadata.getObjectType!();
  const {
    validate: globalValidate,
    authChecker,
    authMode,
    pubSub,
    globalMiddlewares,
    container,
  } = BuildContext;
  const middlewares = globalMiddlewares.concat(fieldResolverMetadata.middlewares!);
  applyAuthChecker(middlewares, authMode, authChecker, fieldResolverMetadata.roles);

  return async (root, args, context, info) => {
    const resolverData: ResolverData<any> = { root, args, context, info };
    const targetInstance: any = convertToType(targetType, root);
    return applyMiddlewares(container, resolverData, middlewares, async () => {
      const handlerOrGetterValue = targetInstance[fieldResolverMetadata.methodName];
      // method
      if (typeof handlerOrGetterValue === "function") {
        const params: any[] = await getParams(
          fieldResolverMetadata.params!,
          resolverData,
          globalValidate,
          pubSub,
        );
        return handlerOrGetterValue.apply(targetInstance, params);
      }
      // getter
      return handlerOrGetterValue;
    });
  };
}

export function createSimpleFieldResolver(
  fieldMetadata: FieldMetadata,
): GraphQLFieldResolver<any, any, any> {
  const { authChecker, authMode, globalMiddlewares, container } = BuildContext;
  const middlewares = globalMiddlewares.concat(fieldMetadata.middlewares!);
  applyAuthChecker(middlewares, authMode, authChecker, fieldMetadata.roles);

  return async (root, args, context, info) => {
    const resolverData: ResolverData<any> = { root, args, context, info };
    return await applyMiddlewares(
      container,
      resolverData,
      middlewares,
      () => root[fieldMetadata.name],
    );
  };
}
