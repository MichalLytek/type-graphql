import { SymbolKeysNotSupportedError } from "../errors";
import { BeforeMiddleware } from "../interfaces/Middleware";
import { MetadataStorage } from "../metadata/metadata-storage";

export function UseBefore(
  middlewares: Array<BeforeMiddleware<any>>,
): MethodDecorator & PropertyDecorator;
export function UseBefore(
  ...middlewares: Array<BeforeMiddleware<any>>
): MethodDecorator & PropertyDecorator;
export function UseBefore(
  ...middlewaresOrMiddlewareArray: any[]
): MethodDecorator | PropertyDecorator {
  return (prototype, propertyKey, descriptor) => {
    if (typeof propertyKey === "symbol") {
      throw new SymbolKeysNotSupportedError();
    }

    let middlewares: Array<BeforeMiddleware<any>>;
    if (Array.isArray(middlewaresOrMiddlewareArray[0])) {
      middlewares = middlewaresOrMiddlewareArray[0];
    } else {
      middlewares = middlewaresOrMiddlewareArray;
    }

    MetadataStorage.collectMiddlewareMetadata({
      target: prototype.constructor,
      fieldName: propertyKey,
      type: "before",
      middlewares,
    });
  };
}
