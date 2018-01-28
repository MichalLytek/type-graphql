import { MetadataStorage } from "../metadata/metadata-storage";
import { getHandlerInfo } from "../helpers/handlers";
import { ReturnTypeFunc, TypeOptions } from "../types";

export function FieldResolver(
  returnTypeFunc?: ReturnTypeFunc,
  options?: TypeOptions,
): MethodDecorator {
  return (prototype, propertyKey) => {
    MetadataStorage.registerFieldResolver({
      kind: "external",
      ...getHandlerInfo(prototype, propertyKey, returnTypeFunc),
    });
  };
}
