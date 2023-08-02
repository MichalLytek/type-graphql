import { SymbolKeysNotSupportedError } from "@/errors";
import { getMetadataStorage } from "@/metadata/getMetadataStorage";
import { type ParameterDecorator } from "@/typings";

export function Info(): ParameterDecorator {
  return (prototype, propertyKey, parameterIndex) => {
    if (typeof propertyKey === "symbol") {
      throw new SymbolKeysNotSupportedError();
    }

    getMetadataStorage().collectHandlerParamMetadata({
      kind: "info",
      target: prototype.constructor,
      methodName: propertyKey,
      index: parameterIndex,
    });
  };
}
