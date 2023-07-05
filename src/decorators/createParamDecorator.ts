import { ResolverData } from "../interfaces";
import { getMetadataStorage } from "../metadata/getMetadataStorage";
import { SymbolKeysNotSupportedError } from "../errors";
import { ParameterDecorator } from "../interfaces/LegacyDecorators";

export function createParamDecorator<TContextType extends object = object>(
  resolver: (resolverData: ResolverData<TContextType>) => any,
): ParameterDecorator {
  return (prototype, propertyKey, parameterIndex) => {
    if (typeof propertyKey === "symbol") {
      throw new SymbolKeysNotSupportedError();
    }
    getMetadataStorage().collectHandlerParamMetadata({
      kind: "custom",
      target: prototype.constructor,
      methodName: propertyKey,
      index: parameterIndex,
      resolver,
    });
  };
}
