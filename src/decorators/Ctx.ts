import { MetadataStorage } from "../metadata/metadata-storage";
import { SymbolKeysNotSupportedError } from "../errors";

export function Ctx(): ParameterDecorator {
  return (prototype, propertyKey, parameterIndex) => {
    if (typeof propertyKey === "symbol") {
      throw new SymbolKeysNotSupportedError();
    }

    MetadataStorage.registerHandlerParam({
      kind: "context",
      target: prototype.constructor,
      methodName: propertyKey,
      index: parameterIndex,
    });
  };
}
