import { ReturnTypeFunc, TypeOptions, ClassType } from "../types";
import { MetadataStorage } from "../metadata/metadata-storage";
import { getHandlerInfo } from "../helpers/handlers";

export function Query(returnTypeFunction: ReturnTypeFunc, options?: TypeOptions): MethodDecorator;
export function Query(returnType: ClassType, options?: TypeOptions): MethodDecorator;
export function Query(
  returnTypeOrFunc: ReturnTypeFunc | ClassType,
  options: TypeOptions = {},
): MethodDecorator {
  return (prototype, methodName) => {
    const handler = getHandlerInfo(prototype, methodName, returnTypeOrFunc, options);
    MetadataStorage.registerQueryHandler(handler);
  };
}
