import { SymbolKeysNotSupportedError } from "../errors";
import { Middleware } from "../interfaces/Middleware";
import { getMetadataStorage } from "../metadata/getMetadataStorage";
import { getArrayFromOverloadedRest } from "../helpers/decorators";
import { MethodPropClassDecorator } from "./types";

export function UseMiddleware(middlewares: Array<Middleware<any>>): MethodPropClassDecorator;
export function UseMiddleware(...middlewares: Array<Middleware<any>>): MethodPropClassDecorator;
export function UseMiddleware(
  ...middlewaresOrMiddlewareArray: Array<Middleware<any> | Array<Middleware<any>>>
): MethodPropClassDecorator {
  const middlewares = getArrayFromOverloadedRest(middlewaresOrMiddlewareArray);

  return (
    target: Function | Object,
    propertyKey?: string | symbol,
    descriptor?: TypedPropertyDescriptor<any>,
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
