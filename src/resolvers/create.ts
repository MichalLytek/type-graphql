import type { GraphQLFieldResolver } from "graphql";
import { AuthMiddleware } from "@/helpers/auth-middleware";
import { convertToType } from "@/helpers/types";
import type {
  BaseResolverMetadata,
  FieldMetadata,
  FieldResolverMetadata,
} from "@/metadata/definitions";
import { BuildContext } from "@/schema/build-context";
import type { ResolverData } from "@/typings";
import type { IOCContainer } from "@/utils/container";
import { isPromiseLike } from "@/utils/isPromiseLike";
import { applyAuthChecker, applyMiddlewares, getParams } from "./helpers";

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
  applyAuthChecker(middlewares, authChecker, container, authMode, resolverMetadata.roles);

  return (root, args, context, info) => {
    const resolverData: ResolverData<any> = { root, args, context, info };
    const targetInstanceOrPromise: Promise<any> | any = container.getInstance(
      resolverMetadata.target,
      resolverData,
    );
    if (isPromiseLike(targetInstanceOrPromise)) {
      return targetInstanceOrPromise.then(targetInstance =>
        applyMiddlewares(container, resolverData, middlewares, () => {
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
          }
          return targetInstance[resolverMetadata.methodName].apply(targetInstance, params);
        }),
      );
    }
    return applyMiddlewares(container, resolverData, middlewares, () => {
      const params: Promise<any[]> | any[] = getParams(
        resolverMetadata.params!,
        resolverData,
        globalValidate,
        pubSub,
      );
      const targetInstance = targetInstanceOrPromise;
      if (isPromiseLike(params)) {
        return params.then(resolvedParams =>
          targetInstance[resolverMetadata.methodName].apply(targetInstance, resolvedParams),
        );
      }
      return targetInstance[resolverMetadata.methodName].apply(targetInstance, params);
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
  applyAuthChecker(middlewares, authChecker, container, authMode, fieldResolverMetadata.roles);

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
      }
      return handlerOrGetterValue.apply(targetInstance, params);
    });
  };
}

export function createBasicFieldResolver(
  fieldMetadata: FieldMetadata,
): GraphQLFieldResolver<any, any, any> {
  const { authChecker, authMode, globalMiddlewares, container } = BuildContext;
  const middlewares = globalMiddlewares.concat(fieldMetadata.middlewares!);
  applyAuthChecker(middlewares, authChecker, container, authMode, fieldMetadata.roles);

  return (root, args, context, info) => {
    const resolverData: ResolverData<any> = { root, args, context, info };
    return applyMiddlewares(container, resolverData, middlewares, () => root[fieldMetadata.name]);
  };
}

export function wrapResolverWithAuthChecker(
  resolver: GraphQLFieldResolver<any, any>,
  container: IOCContainer,
  roles: any[] | undefined,
): GraphQLFieldResolver<any, any> {
  const { authChecker, authMode } = BuildContext;
  if (!authChecker || !roles) {
    return resolver;
  }

  return (root, args, context, info) => {
    const resolverData: ResolverData<any> = { root, args, context, info };
    return AuthMiddleware(
      authChecker,
      container,
      authMode,
      roles,
    )(resolverData, async () => resolver(root, args, context, info));
  };
}
