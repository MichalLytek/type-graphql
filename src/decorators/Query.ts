import { ReturnTypeFunc, BasicOptions } from "../types/decorators";
import { MetadataStorage } from "../metadata/metadata-storage";
import { getHandlerInfo } from "../helpers/handlers";
import { getTypeDecoratorParams } from "../helpers/decorators";

export function Query(options?: BasicOptions): MethodDecorator;
export function Query(returnTypeFunc: ReturnTypeFunc, options?: BasicOptions): MethodDecorator;
export function Query(
  returnTypeFuncOrOptions?: ReturnTypeFunc | BasicOptions,
  maybeOptions?: BasicOptions,
): MethodDecorator {
  const { options, returnTypeFunc } = getTypeDecoratorParams(returnTypeFuncOrOptions, maybeOptions);
  return (prototype, methodName) => {
    const handler = getHandlerInfo(prototype, methodName, returnTypeFunc, options, options);
    MetadataStorage.registerQueryHandler(handler);
  };
}
