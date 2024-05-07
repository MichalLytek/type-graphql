import { SymbolKeysNotSupportedError } from "@/errors";
import { getArrayFromOverloadedRest } from "@/helpers/decorators";
import { getMetadataStorage } from "@/metadata/getMetadataStorage";
import { type Middleware } from "@/typings/middleware";
import { type MethodPropClassDecorator } from "./types";

export function UseMiddleware(middlewares: Array<Middleware<any>>): MethodPropClassDecorator;
export function UseMiddleware(...middlewares: Array<Middleware<any>>): MethodPropClassDecorator;
export function UseMiddleware(
  ...middlewaresOrMiddlewareArray: Array<Middleware<any> | Array<Middleware<any>>>
): MethodPropClassDecorator {
  const middlewares = getArrayFromOverloadedRest(middlewaresOrMiddlewareArray);

  return (
    target: Function | Object,
    propertyKey?: string | symbol,
    _descriptor?: TypedPropertyDescriptor<any>,
  ) => {
    if (propertyKey == null) {
      getMetadataStorage().collectResolverMiddlewareMetadata({
        target: target as Function,
        middlewares,
      });
      return;
    }

    if (typeof propertyKey === "symbol") {
      throw new SymbolKeysNotSupportedError();
    }

    getMetadataStorage().collectMiddlewareMetadata({
      target: target.constructor,
      fieldName: propertyKey,
      middlewares,
    });
  };
}
