import { MetadataStorage } from "../metadata/metadata-storage";
import { ReturnTypeFunc, AdvancedOptions } from "../types/decorators";
import { findType } from "../helpers/findType";
import { getTypeDecoratorParams } from "../helpers/decorators";
import { SymbolKeysNotSupportedError } from "../errors";

export type MethodAndPropDecorator = PropertyDecorator & MethodDecorator;

export function Field(options?: AdvancedOptions): MethodAndPropDecorator;
export function Field(
  returnTypeFunction?: ReturnTypeFunc,
  options?: AdvancedOptions,
): MethodAndPropDecorator;
export function Field(
  returnTypeFuncOrOptions?: ReturnTypeFunc | AdvancedOptions,
  maybeOptions?: AdvancedOptions,
): MethodDecorator | PropertyDecorator {
  return (prototype, propertyKey, descriptor) => {
    if (typeof propertyKey === "symbol") {
      throw new SymbolKeysNotSupportedError();
    }

    const { options, returnTypeFunc } = getTypeDecoratorParams(
      returnTypeFuncOrOptions,
      maybeOptions,
    );
    const isResolver = Boolean(descriptor);
    const isResolverMethod = Boolean(descriptor && descriptor.value);

    const { getType, typeOptions } = findType({
      metadataKey: isResolverMethod ? "design:returntype" : "design:type",
      prototype,
      propertyKey,
      returnTypeFunc,
      typeOptions: options,
    });

    MetadataStorage.collectClassFieldMetadata({
      name: propertyKey,
      getType,
      typeOptions,
      target: prototype.constructor,
      description: options.description,
      deprecationReason: options.deprecationReason,
    });

    if (isResolver) {
      MetadataStorage.collectFieldResolverMetadata({
        kind: "internal",
        methodName: propertyKey,
        target: prototype.constructor,
        handler: isResolverMethod ? (prototype as any)[propertyKey] : undefined,
      });
    }
  };
}
