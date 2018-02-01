import { ReturnTypeFunc, TypeOptions } from "../types/decorators";
import { MetadataStorage } from "../metadata/metadata-storage";
import { getHandlerInfo } from "../helpers/handlers";
import { getDecoratorParams } from "../helpers/decorators";

export function Query(options?: TypeOptions): MethodDecorator;
export function Query(returnTypeFunc: ReturnTypeFunc, options?: TypeOptions): MethodDecorator;
export function Query(
  returnTypeFuncOrOptions?: ReturnTypeFunc | TypeOptions,
  maybeOptions?: TypeOptions,
): MethodDecorator {
  const { options, returnTypeFunc } = getDecoratorParams(returnTypeFuncOrOptions, maybeOptions);
  return (prototype, methodName) => {
    const handler = getHandlerInfo(prototype, methodName, returnTypeFunc, options);
    MetadataStorage.registerQueryHandler(handler);
  };
}
