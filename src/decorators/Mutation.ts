import { ReturnTypeFunc, TypeOptions } from "../types/decorators";
import { MetadataStorage } from "../metadata/metadata-storage";
import { getHandlerInfo } from "../helpers/handlers";
import { getDecoratorParams } from "../helpers/decorators";

export function Mutation(
  options?: TypeOptions,
): MethodDecorator;
export function Mutation(
  returnTypeFunc: ReturnTypeFunc,
  options?: TypeOptions,
): MethodDecorator;
export function Mutation(
  returnTypeFuncOrOptions?: ReturnTypeFunc | TypeOptions,
  maybeOptions?: TypeOptions,
): MethodDecorator {
  const { options, returnTypeFunc } = getDecoratorParams(returnTypeFuncOrOptions, maybeOptions);
  return (prototype, methodName) => {
    const handler = getHandlerInfo(prototype, methodName, returnTypeFunc, options);
    MetadataStorage.registerMutationHandler(handler);
  };
}
