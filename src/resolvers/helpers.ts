import { type PubSubEngine } from "graphql-subscriptions";
import { AuthMiddleware } from "@/helpers/auth-middleware";
import { convertToType } from "@/helpers/types";
import { type ParamMetadata } from "@/metadata/definitions";
import { type ValidateSettings } from "@/schema/build-context";
import { type AuthChecker, type AuthMode, type ResolverData, type ValidatorFn } from "@/typings";
import { type Middleware, type MiddlewareClass, type MiddlewareFn } from "@/typings/Middleware";
import { type IOCContainer } from "@/utils/container";
import { isPromiseLike } from "@/utils/isPromiseLike";
import { convertArgToInstance, convertArgsToInstance } from "./convert-args";
import { validateArg } from "./validate-arg";

export function getParams(
  params: ParamMetadata[],
  resolverData: ResolverData<any>,
  globalValidate: ValidateSettings,
  validateFn: ValidatorFn | undefined,
  pubSub: PubSubEngine,
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
            paramInfo.validate,
            validateFn,
          );

        case "arg":
          return validateArg(
            convertArgToInstance(paramInfo, resolverData.args),
            paramInfo.getType(),
            resolverData,
            globalValidate,
            paramInfo.validate,
            validateFn,
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

        case "pubSub":
          if (paramInfo.triggerKey) {
            return (payload: any) => pubSub.publish(paramInfo.triggerKey!, payload);
          }
          return pubSub;

        case "custom":
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
): Promise<any> {
  if (middlewares.length === 0) {
    return resolverHandlerFunction();
  }
  let middlewaresIndex = -1;
  async function dispatchHandler(currentIndex: number): Promise<void> {
    if (currentIndex <= middlewaresIndex) {
      throw new Error("next() called multiple times");
    }
    middlewaresIndex = currentIndex;
    let handlerFn: MiddlewareFn<any>;
    if (currentIndex === middlewares.length) {
      handlerFn = resolverHandlerFunction;
    } else {
      const currentMiddleware = middlewares[currentIndex];
      // Arrow function or class
      if (currentMiddleware.prototype !== undefined) {
        const middlewareClassInstance = await container.getInstance(
          currentMiddleware as MiddlewareClass<any>,
          resolverData,
        );
        handlerFn = middlewareClassInstance.use.bind(middlewareClassInstance);
      } else {
        handlerFn = currentMiddleware as MiddlewareFn<any>;
      }
    }
    let nextResult: any;
    const result = await handlerFn(resolverData, async () => {
      nextResult = await dispatchHandler(currentIndex + 1);
      return nextResult;
    });
    return result !== undefined ? result : nextResult;
  }

  return dispatchHandler(0);
}
