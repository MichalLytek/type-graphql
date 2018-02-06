import { ReturnTypeFunc, BasicOptions } from "../types/decorators";
import { MetadataStorage } from "../metadata/metadata-storage";
import { getHandlerInfo } from "../helpers/handlers";
import { getTypeDecoratorParams } from "../helpers/decorators";

export function Mutation(options?: BasicOptions): MethodDecorator;
export function Mutation(returnTypeFunc: ReturnTypeFunc, options?: BasicOptions): MethodDecorator;
export function Mutation(
  returnTypeFuncOrOptions?: ReturnTypeFunc | BasicOptions,
  maybeOptions?: BasicOptions,
): MethodDecorator {
  const { options, returnTypeFunc } = getTypeDecoratorParams(returnTypeFuncOrOptions, maybeOptions);
  return (prototype, methodName) => {
    const handler = getHandlerInfo(prototype, methodName, returnTypeFunc, options, options);
    MetadataStorage.registerMutationHandler(handler);
  };
}
