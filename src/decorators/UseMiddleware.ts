import { SymbolKeysNotSupportedError } from "../errors";
import { Middleware } from "../interfaces/Middleware";
import { MetadataStorage } from "../metadata/metadata-storage";
import { getArrayFromOverloadedRest } from "../helpers/decorators";

export function UseMiddleware(
  middlewares: Array<Middleware<any>>,
): MethodDecorator & PropertyDecorator;
export function UseMiddleware(
  ...middlewares: Array<Middleware<any>>
): MethodDecorator & PropertyDecorator;
export function UseMiddleware(
  ...middlewaresOrMiddlewareArray: Array<Middleware<any> | Array<Middleware<any>>>
): MethodDecorator | PropertyDecorator {
  const middlewares = getArrayFromOverloadedRest(middlewaresOrMiddlewareArray);

  return (prototype, propertyKey, descriptor) => {
    if (typeof propertyKey === "symbol") {
      throw new SymbolKeysNotSupportedError();
    }

    MetadataStorage.collectMiddlewareMetadata({
      target: prototype.constructor,
      fieldName: propertyKey,
      middlewares,
    });
  };
}
