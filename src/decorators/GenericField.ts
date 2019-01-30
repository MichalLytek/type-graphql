import { getMetadataStorage } from "../metadata/getMetadataStorage";
import { MethodAndPropDecorator, GenericFieldOptions } from "./types";
import { SymbolKeysNotSupportedError } from "../errors";

export function GenericField(options?: GenericFieldOptions): MethodAndPropDecorator;
export function GenericField(options?: GenericFieldOptions): MethodDecorator {
  return (prototype, propertyKey, descriptor) => {
    if (typeof propertyKey === "symbol") {
      throw new SymbolKeysNotSupportedError();
    }
    const opts = options || {};
    getMetadataStorage().collectGenericFieldMetadata({
      name: propertyKey,
      array: opts.array,
      target: prototype.constructor,
      transformFields: opts.transformFields,
      nullable: opts.nullable,
    });
  };
}
