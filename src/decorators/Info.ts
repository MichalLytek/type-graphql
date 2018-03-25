import { MetadataStorage } from "../metadata/metadata-storage";
import { SymbolKeysNotSupportedError } from "../errors";

export function Info(): ParameterDecorator {
  return (prototype, propertyKey, parameterIndex) => {
    if (typeof propertyKey === "symbol") {
      throw new SymbolKeysNotSupportedError();
    }

    MetadataStorage.collectHandlerParamMetadata({
      kind: "info",
      target: prototype.constructor,
      methodName: propertyKey,
      index: parameterIndex,
    });
  };
}
