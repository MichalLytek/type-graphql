import { AuthMiddleware } from "@/helpers/auth-middleware";
import { convertToType } from "@/helpers/types";
import { type ParamMetadata } from "@/metadata/definitions";
import { type ValidateSettings } from "@/schema/build-context";
import {
  type AuthChecker,
  type AuthMode,
  type MaybePromise,
  type ResolverData,
  type ValidatorFn,
} from "@/typings";
import { type Middleware, type MiddlewareClass, type MiddlewareFn } from "@/typings/middleware";
import { type IOCContainer } from "@/utils/container";
import { isPromiseLike } from "@/utils/isPromiseLike";
import { convertArgToInstance, convertArgsToInstance } from "./convert-args";
import { validateArg } from "./validate-arg";

export function getParams(
  params: ParamMetadata[],
  resolverData: ResolverData<any>,
  globalValidate: ValidateSettings,
  globalValidateFn: ValidatorFn | undefined,
): Promise<any[]> | any[] {
  const paramValues = params
    .sort((a, b) => a.index - b.index)
    // eslint-disable-next-line array-callback-return, consistent-return
    .map(paramInfo => {
      switch (paramInfo.kind) {
        case "args":
          return validateArg(
            convertArgsToInstance(paramInfo, resolverData.args),
            paramInfo.getType(),
            resolverData,
            globalValidate,
            paramInfo.validateSettings,
            globalValidateFn,
            paramInfo.validateFn,
          );

        case "arg":
          return validateArg(
            convertArgToInstance(paramInfo, resolverData.args),
            paramInfo.getType(),
            resolverData,
            globalValidate,
            paramInfo.validateSettings,
            globalValidateFn,
            paramInfo.validateFn,
          );

        case "context":
          if (paramInfo.propertyName) {
            return resolverData.context[paramInfo.propertyName];
          }
          return resolverData.context;

        case "root": {
          const rootValue = paramInfo.propertyName
            ? resolverData.root[paramInfo.propertyName]
            : resolverData.root;

          if (!paramInfo.getType) {
            return rootValue;
          }
          return convertToType(paramInfo.getType(), rootValue);
        }

        case "info":
          return resolverData.info;

        case "custom":
          if (paramInfo.options.arg) {
            const arg = paramInfo.options.arg!;
            return validateArg(
              convertArgToInstance(arg, resolverData.args),
              arg.getType(),
              resolverData,
              globalValidate,
              arg.validateSettings,
              globalValidateFn,
              arg.validateFn,
            ).then(() => paramInfo.resolver(resolverData));
          }
          return paramInfo.resolver(resolverData);

        // no default
      }
    });

  if (paramValues.some(isPromiseLike)) {
    return Promise.all(paramValues);
  }
  return paramValues;
}

export function applyAuthChecker(
  middlewares: Array<Middleware<any>>,
  authChecker: AuthChecker<any, any> | undefined,
  container: IOCContainer,
  authMode: AuthMode,
  roles: any[] | undefined,
) {
  if (authChecker && roles) {
    middlewares.unshift(AuthMiddleware(authChecker, container, authMode, roles));
  }
}

export function applyMiddlewares(
  container: IOCContainer,
  resolverData: ResolverData<any>,
  middlewares: Array<Middleware<any>>,
  resolverHandlerFunction: () => any,
): MaybePromise<any> {
  if (middlewares.length === 0) {
    return resolverHandlerFunction();
  }
  // Fast path for a single function middleware (the common `@Authorized`-only
  // field): invoke it directly with a terminal `next`, skipping the dispatcher
  // recursion and its per-field closures. Behavior matches the general path:
  // same `result ?? nextResult` resolution and multiple-`next()` guard.
  if (middlewares.length === 1 && middlewares[0].prototype === undefined) {
    const middleware = middlewares[0] as MiddlewareFn<any>;
    let nextResult: any;
    let nextCalled = false;
    const next = () => {
      if (nextCalled) {
        throw new Error("next() called multiple times");
      }
      nextCalled = true;
      nextResult = resolverHandlerFunction();
      return nextResult;
    };
    const finalize = (result: any) => (result !== undefined ? result : nextResult);
    const result = middleware(resolverData, next);
    return isPromiseLike(result) ? result.then(finalize) : finalize(result);
  }
  let middlewaresIndex = -1;
  // Synchronous-capable dispatch: only awaits when a middleware (or the
  // container instance, or the resolver) actually returns a promise. A chain of
  // synchronous middlewares — notably a synchronous `AuthMiddleware` — now costs
  // zero promises instead of one per middleware. Behavior is preserved: same
  // `result ?? nextResult` resolution and the same multiple-`next()` guard.
  function dispatchHandler(currentIndex: number): any {
    if (currentIndex <= middlewaresIndex) {
      throw new Error("next() called multiple times");
    }
    middlewaresIndex = currentIndex;
    if (currentIndex === middlewares.length) {
      return resolverHandlerFunction();
    }

    let nextResult: any;
    const next = () => {
      nextResult = dispatchHandler(currentIndex + 1);
      return nextResult;
    };
    const finalize = (result: any) => (result !== undefined ? result : nextResult);
    const invoke = (handlerFn: MiddlewareFn<any>) => {
      const result = handlerFn(resolverData, next);
      return isPromiseLike(result) ? result.then(finalize) : finalize(result);
    };

    const currentMiddleware = middlewares[currentIndex];
    // Arrow function or class
    if (currentMiddleware.prototype !== undefined) {
      const instanceOrPromise = container.getInstance(
        currentMiddleware as MiddlewareClass<any>,
        resolverData,
      );
      return isPromiseLike(instanceOrPromise)
        ? instanceOrPromise.then(instance => invoke(instance.use.bind(instance)))
        : invoke(instanceOrPromise.use.bind(instanceOrPromise));
    }
    return invoke(currentMiddleware as MiddlewareFn<any>);
  }

  return dispatchHandler(0);
}
