import { MethodAndPropDecorator } from "./types";
import { SymbolKeysNotSupportedError } from "../errors";
import { getMetadataStorage } from "../metadata/getMetadataStorage";

export function Extensions(
  extensions: Record<string, any>,
): MethodAndPropDecorator & ClassDecorator;
export function Extensions(
  extensions: Record<string, any>,
): MethodDecorator | PropertyDecorator | ClassDecorator {
  return (targetOrPrototype, propertyKey, descriptor) => {
    if (typeof propertyKey === "symbol") {
      throw new SymbolKeysNotSupportedError();
    }
    if (propertyKey) {
      getMetadataStorage().collectExtensionsFieldMetadata({
        target: targetOrPrototype.constructor,
        fieldName: propertyKey,
        extensions,
      });
    } else {
      getMetadataStorage().collectExtensionsClassMetadata({
        target: targetOrPrototype as Function,
        extensions,
      });
    }
  };
}
