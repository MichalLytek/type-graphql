import { ReturnTypeFunc, AdvancedOptions } from "../types/decorators";
import { MetadataStorage } from "../metadata/metadata-storage";
import { getHandlerInfo } from "../helpers/handlers";
import { getTypeDecoratorParams } from "../helpers/decorators";

export function Mutation(options?: AdvancedOptions): MethodDecorator;
export function Mutation(
  returnTypeFunc: ReturnTypeFunc,
  options?: AdvancedOptions,
): MethodDecorator;
export function Mutation(
  returnTypeFuncOrOptions?: ReturnTypeFunc | AdvancedOptions,
  maybeOptions?: AdvancedOptions,
): MethodDecorator {
  const { options, returnTypeFunc } = getTypeDecoratorParams(returnTypeFuncOrOptions, maybeOptions);
  return (prototype, methodName) => {
    const handler = getHandlerInfo(prototype, methodName, returnTypeFunc, options);
    MetadataStorage.registerMutationHandler(handler);
  };
}
