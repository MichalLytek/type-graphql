import { ReturnTypeFunc, TypeOptions, ClassType } from "../types";
import { MetadataStorage } from "../metadata/metadata-storage";
import { getHandlerInfo } from "../helpers/handlers";

export function Mutation(
  returnTypeFunction?: ReturnTypeFunc,
  options?: TypeOptions,
): MethodDecorator;
export function Mutation(returnType?: ClassType, options?: TypeOptions): MethodDecorator;
export function Mutation(
  returnTypeOrFunc?: ReturnTypeFunc | ClassType,
  options: TypeOptions = {},
): MethodDecorator {
  return (prototype, methodName) => {
    const handler = getHandlerInfo(prototype, methodName, returnTypeOrFunc, options);
    MetadataStorage.registerMutationHandler(handler);
  };
}
