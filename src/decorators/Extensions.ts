import { SymbolKeysNotSupportedError } from "../errors";
import { getMetadataStorage } from "../metadata/getMetadataStorage";

export function Extensions(extensions: Record<string, any>): MethodDecorator | PropertyDecorator {
  return (target, propertyKey, descriptor) => {
    if (typeof propertyKey === "symbol") {
      throw new SymbolKeysNotSupportedError();
    }
    getMetadataStorage().collectExtensionsMetadata({
      target: target.constructor,
      fieldName: propertyKey,
      extensions,
    });
  };
}
