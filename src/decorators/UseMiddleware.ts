import { SymbolKeysNotSupportedError } from "../errors";
import { Middleware } from "../interfaces/Middleware";
import { getMetadataStorage } from "../metadata/getMetadataStorage";
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

    getMetadataStorage().collectMiddlewareMetadata({
      target: prototype.constructor,
      fieldName: propertyKey,
      middlewares,
    });
  };
}
