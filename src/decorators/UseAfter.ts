import { SymbolKeysNotSupportedError } from "../errors";
import { AfterMiddleware } from "../interfaces/Middleware";
import { MetadataStorage } from "../metadata/metadata-storage";

export function UseAfter(
  middlewares: Array<AfterMiddleware<any>>,
): MethodDecorator & PropertyDecorator;
export function UseAfter(
  ...middlewares: Array<AfterMiddleware<any>>
): MethodDecorator & PropertyDecorator;
export function UseAfter(
  ...middlewaresOrMiddlewareArray: any[]
): MethodDecorator | PropertyDecorator {
  return (prototype, propertyKey, descriptor) => {
    if (typeof propertyKey === "symbol") {
      throw new SymbolKeysNotSupportedError();
    }

    let middlewares: Array<AfterMiddleware<any>>;
    if (Array.isArray(middlewaresOrMiddlewareArray[0])) {
      middlewares = middlewaresOrMiddlewareArray[0];
    } else {
      middlewares = middlewaresOrMiddlewareArray;
    }

    MetadataStorage.collectMiddlewareMetadata({
      target: prototype.constructor,
      fieldName: propertyKey,
      type: "after",
      middlewares,
    });
  };
}
