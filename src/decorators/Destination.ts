import { getMetadataStorage } from "../metadata/getMetadataStorage";
import { ReturnTypeFunc, AdvancedOptions, MethodAndPropDecorator } from "./types";
import { SymbolKeysNotSupportedError } from "../errors";

export function Destination(): MethodAndPropDecorator;
export function Destination(): MethodDecorator {
  return (prototype, propertyKey, descriptor) => {
    if (typeof propertyKey === "symbol") {
      throw new SymbolKeysNotSupportedError();
    }
    getMetadataStorage().collectDestinationMetadata({
      name: propertyKey,
      target: prototype.constructor,
    });
  };
}
