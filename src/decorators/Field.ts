import { MetadataStorage } from "../metadata/metadata-storage";
import { ReturnTypeFunc, AdvancedOptions } from "../types/decorators";
import { findType } from "../helpers/findType";
import { getTypeDecoratorParams } from "../helpers/decorators";

export function Field(options?: AdvancedOptions): PropertyDecorator;
export function Field(
  returnTypeFunction?: ReturnTypeFunc,
  options?: AdvancedOptions,
): PropertyDecorator;
export function Field(options?: AdvancedOptions): MethodDecorator;
export function Field(
  returnTypeFunction?: ReturnTypeFunc,
  options?: AdvancedOptions,
): MethodDecorator;
export function Field(
  returnTypeFuncOrOptions?: ReturnTypeFunc | AdvancedOptions,
  maybeOptions?: AdvancedOptions,
): PropertyDecorator | MethodDecorator {
  return (prototype, propertyKey, descriptor) => {
    if (typeof propertyKey === "symbol") {
      throw new Error("Symbol keys are not supported yet!");
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

    MetadataStorage.registerClassField({
      name: propertyKey,
      getType,
      typeOptions,
      target: prototype.constructor,
      description: options.description,
      deprecationReason: options.deprecationReason,
    });

    if (isResolver) {
      const methodName = propertyKey as keyof typeof prototype;
      MetadataStorage.registerFieldResolver({
        kind: "internal",
        methodName,
        target: prototype.constructor,
        handler: isResolverMethod ? prototype[methodName] : undefined,
      });
    }
  };
}
