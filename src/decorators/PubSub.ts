import { MetadataStorage } from "../metadata/metadata-storage";
import { SymbolKeysNotSupportedError } from "../errors";

export function PubSub(triggerKey?: string): ParameterDecorator {
  return (prototype, propertyKey, parameterIndex) => {
    if (typeof propertyKey === "symbol") {
      throw new SymbolKeysNotSupportedError();
    }

    MetadataStorage.collectHandlerParamMetadata({
      kind: "pubSub",
      target: prototype.constructor,
      methodName: propertyKey,
      index: parameterIndex,
      triggerKey,
    });
  };
}
