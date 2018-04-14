import { SymbolKeysNotSupportedError } from "../errors";
import { Middleware } from "../interfaces/Middleware";
import { MetadataStorage } from "../metadata/metadata-storage";

export function UseMiddleware(
  middlewares: Array<Middleware<any>>,
): MethodDecorator & PropertyDecorator;
export function UseMiddleware(
  ...middlewares: Array<Middleware<any>>
): MethodDecorator & PropertyDecorator;
export function UseMiddleware(
  ...middlewaresOrMiddlewareArray: any[]
): MethodDecorator | PropertyDecorator {
  return (prototype, propertyKey, descriptor) => {
    if (typeof propertyKey === "symbol") {
      throw new SymbolKeysNotSupportedError();
    }

    let middlewares: Array<Middleware<any>>;
    if (Array.isArray(middlewaresOrMiddlewareArray[0])) {
      middlewares = middlewaresOrMiddlewareArray[0];
    } else {
      middlewares = middlewaresOrMiddlewareArray;
    }

    MetadataStorage.collectMiddlewareMetadata({
      target: prototype.constructor,
      fieldName: propertyKey,
      middlewares,
    });
  };
}
