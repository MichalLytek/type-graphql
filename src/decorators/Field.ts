import { MetadataStorage } from "../metadata/metadata-storage";
import { ReturnTypeFunc, TypeOptions, ClassType } from "../types";
import { getType, TypeInfo } from "../helpers/getType";
import { getHandlerInfo } from "../helpers/handlers";

export function Field(
  returnTypeFunction?: ReturnTypeFunc,
  options?: TypeOptions,
): PropertyDecorator;
export function Field(returnType?: ClassType, options?: TypeOptions): PropertyDecorator;
export function Field(returnTypeFunction?: ReturnTypeFunc, options?: TypeOptions): MethodDecorator;
export function Field(returnType?: ClassType, options?: TypeOptions): MethodDecorator;
export function Field(
  returnTypeOrFunc?: ReturnTypeFunc | ClassType,
  options: TypeOptions = {},
): PropertyDecorator | MethodDecorator {
  return (prototype, propertyKey, descriptor) => {
    if (typeof propertyKey === "symbol") {
      throw new Error("Symbol keys are not supported yet!");
    }
    const isResolverMethod = descriptor && descriptor.value;

    const { type, typeOptions } = getType({
      metadataKey: isResolverMethod ? "design:returntype" : "design:type",
      prototype,
      propertyKey,
      returnTypeOrFunc,
      typeOptions: options,
    });

    MetadataStorage.registerClassField({
      name: propertyKey,
      type,
      typeOptions,
      target: prototype.constructor,
    });

    if (isResolverMethod) {
      MetadataStorage.registerFieldResolver({
        type: "internal",
        ...getHandlerInfo(prototype, propertyKey, returnTypeOrFunc),
      });
    }
  };
}
