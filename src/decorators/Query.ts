import { ReturnTypeFunc, AdvancedOptions } from "./types";
import { getMetadataStorage } from "../metadata/getMetadataStorage";
import { getHandlerInfo } from "../helpers/handlers";
import { getTypeDecoratorParams } from "../helpers/decorators";

export function Query(): MethodDecorator;
export function Query(options: AdvancedOptions): MethodDecorator;
export function Query(returnTypeFunc: ReturnTypeFunc, options?: AdvancedOptions): MethodDecorator;
export function Query(
  returnTypeFuncOrOptions?: ReturnTypeFunc | AdvancedOptions,
  maybeOptions?: AdvancedOptions,
): MethodDecorator {
  const { options, returnTypeFunc } = getTypeDecoratorParams(returnTypeFuncOrOptions, maybeOptions);
  return (prototype, methodName) => {
    const handler = getHandlerInfo(prototype, methodName, returnTypeFunc, options);
    getMetadataStorage().collectQueryHandlerMetadata(handler);
  };
}
