import { MetadataStorage } from "../metadata/metadata-storage";
import { ReturnTypeFunc, TypeOptions, ClassType } from "../types";
import { findType, TypeInfo } from "../helpers/findType";
import { getHandlerInfo } from "../helpers/handlers";

export function Field(
  returnTypeFunction?: ReturnTypeFunc,
  options?: TypeOptions,
): PropertyDecorator;
export function Field(returnTypeFunction?: ReturnTypeFunc, options?: TypeOptions): MethodDecorator;
export function Field(
  returnTypeFunc?: ReturnTypeFunc,
  options: TypeOptions = {},
): PropertyDecorator | MethodDecorator {
  return (prototype, propertyKey, descriptor) => {
    if (typeof propertyKey === "symbol") {
      throw new Error("Symbol keys are not supported yet!");
    }
    const isResolverMethod = descriptor && descriptor.value;

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

    if (isResolverMethod) {
      MetadataStorage.registerFieldResolver({
        kind: "internal",
        ...getHandlerInfo(prototype, propertyKey, returnTypeFunc),
      });
    }
  };
}
