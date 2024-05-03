import { SymbolKeysNotSupportedError } from "@/errors";
import { type ExtensionsMetadata } from "@/metadata/definitions";
import { getMetadataStorage } from "@/metadata/getMetadataStorage";
import { type MethodAndPropDecorator } from "./types";

export function Extensions(extensions: ExtensionsMetadata): MethodAndPropDecorator & ClassDecorator;
export function Extensions(
  extensions: ExtensionsMetadata,
): MethodDecorator | PropertyDecorator | ClassDecorator {
  return (targetOrPrototype, propertyKey, _descriptor) => {
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
