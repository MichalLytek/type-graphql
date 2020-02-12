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
import isPromiseLike from "../utils/isPromiseLike";

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
  } = BuildContext;
  const middlewares = globalMiddlewares.concat(resolverMetadata.middlewares!);
  applyAuthChecker(middlewares, authMode, authChecker, resolverMetadata.roles);

  return (root, args, context, info) => {
    const resolverData: ResolverData<any> = { root, args, context, info };
    const targetInstance = container.getInstance(resolverMetadata.target, resolverData);
    return applyMiddlewares(container, resolverData, middlewares, () => {
      const params: Promise<any[]> | any[] = getParams(
        resolverMetadata.params!,
        resolverData,
        globalValidate,
        pubSub,
      );
      if (isPromiseLike(params)) {
        return params.then(resolvedParams =>
          targetInstance[resolverMetadata.methodName].apply(targetInstance, resolvedParams),
        );
      } else {
        return targetInstance[resolverMetadata.methodName].apply(targetInstance, params);
      }
    });
  };
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

  return (root, args, context, info) => {
    const resolverData: ResolverData<any> = { root, args, context, info };
    const targetInstance: any = convertToType(targetType, root);
    return applyMiddlewares(container, resolverData, middlewares, () => {
      const handlerOrGetterValue = targetInstance[fieldResolverMetadata.methodName];
      if (typeof handlerOrGetterValue !== "function") {
        // getter
        return handlerOrGetterValue;
      }
      // method
      const params: Promise<any[]> | any[] = getParams(
        fieldResolverMetadata.params!,
        resolverData,
        globalValidate,
        pubSub,
      );
      if (isPromiseLike(params)) {
        return params.then(resolvedParams =>
          handlerOrGetterValue.apply(targetInstance, resolvedParams),
        );
      } else {
        return handlerOrGetterValue.apply(targetInstance, params);
      }
    });
  };
}

export function createBasicFieldResolver(
  fieldMetadata: FieldMetadata,
): GraphQLFieldResolver<any, any, any> {
  const { authChecker, authMode, globalMiddlewares, container } = BuildContext;
  const middlewares = globalMiddlewares.concat(fieldMetadata.middlewares!);
  applyAuthChecker(middlewares, authMode, authChecker, fieldMetadata.roles);

  return (root, args, context, info) => {
    const resolverData: ResolverData<any> = { root, args, context, info };
    return applyMiddlewares(container, resolverData, middlewares, () => root[fieldMetadata.name]);
  };
}
