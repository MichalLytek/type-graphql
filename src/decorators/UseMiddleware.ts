import { SymbolKeysNotSupportedError } from "@/errors";
import { getArrayFromOverloadedRest } from "@/helpers/decorators";
import { getMetadataStorage } from "@/metadata/getMetadataStorage";
import type { Middleware } from "@/typings/Middleware";
import type { MethodAndPropDecorator } from "./types";

export function UseMiddleware(middlewares: Middleware<any>[]): MethodAndPropDecorator;
export function UseMiddleware(...middlewares: Middleware<any>[]): MethodAndPropDecorator;
export function UseMiddleware(
  ...middlewaresOrMiddlewareArray: (Middleware<any> | Middleware<any>[])[]
): MethodDecorator | PropertyDecorator {
  const middlewares = getArrayFromOverloadedRest(middlewaresOrMiddlewareArray);

  return (prototype, propertyKey, _descriptor) => {
    if (typeof propertyKey === "symbol") {
      throw new SymbolKeysNotSupportedError();
    }

    getMetadataStorage().collectMiddlewareMetadata({
      target: prototype.constructor,
      fieldName: propertyKey,
      middlewares,
    });
  };
}
