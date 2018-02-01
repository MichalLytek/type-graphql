import { MetadataStorage } from "../metadata/metadata-storage";
import { ReturnTypeFunc, TypeOptions } from "../types/decorators";
import { findType } from "../helpers/findType";
import { getDecoratorParams } from "../helpers/decorators";

export function Field(
  returnTypeFunction?: ReturnTypeFunc,
  options?: TypeOptions,
): PropertyDecorator;
export function Field(options?: TypeOptions): PropertyDecorator;
export function Field(options?: TypeOptions): MethodDecorator;
export function Field(returnTypeFunction?: ReturnTypeFunc, options?: TypeOptions): MethodDecorator;
export function Field(
  returnTypeFuncOrOptions?: ReturnTypeFunc | TypeOptions,
  maybeOptions?: TypeOptions,
): PropertyDecorator | MethodDecorator {
  return (prototype, propertyKey, descriptor) => {
    if (typeof propertyKey === "symbol") {
      throw new Error("Symbol keys are not supported yet!");
    }

    const { options, returnTypeFunc } = getDecoratorParams(returnTypeFuncOrOptions, maybeOptions);
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
    });

    if (isResolver) {
      const methodName = propertyKey as keyof typeof prototype;
      MetadataStorage.registerFieldResolver({
        kind: "internal",
        methodName,
        target: prototype.constructor,
      });
    }
  };
}
