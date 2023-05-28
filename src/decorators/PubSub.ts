import { SymbolKeysNotSupportedError } from "@/errors";
import { getMetadataStorage } from "@/metadata/getMetadataStorage";
import type { ParameterDecorator } from "@/typings";

export function PubSub(triggerKey?: string): ParameterDecorator {
  return (prototype, propertyKey, parameterIndex) => {
    if (typeof propertyKey === "symbol") {
      throw new SymbolKeysNotSupportedError();
    }

    getMetadataStorage().collectHandlerParamMetadata({
      kind: "pubSub",
      target: prototype.constructor,
      methodName: propertyKey,
      index: parameterIndex,
      triggerKey,
    });
  };
}
