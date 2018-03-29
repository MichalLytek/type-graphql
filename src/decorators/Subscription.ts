import { ReturnTypeFunc, AdvancedOptions } from "../types/decorators";
import { MetadataStorage } from "../metadata/metadata-storage";
import { getHandlerInfo } from "../helpers/handlers";
import { getTypeDecoratorParams } from "../helpers/decorators";

export interface SubscriptionOptions extends AdvancedOptions {
  filter?: string | string[];
}

export function Subscription(options?: SubscriptionOptions): MethodDecorator;
export function Subscription(
  returnTypeFunc: ReturnTypeFunc,
  options?: SubscriptionOptions,
): MethodDecorator;
export function Subscription(
  returnTypeFuncOrOptions?: ReturnTypeFunc | SubscriptionOptions,
  maybeOptions?: SubscriptionOptions,
): MethodDecorator {
  const { options, returnTypeFunc } = getTypeDecoratorParams(returnTypeFuncOrOptions, maybeOptions);
  return (prototype, methodName) => {
    const handler = getHandlerInfo(prototype, methodName, returnTypeFunc, options);
    MetadataStorage.collectSubscriptionHandlerMetadata({
      ...handler,
      filter: ([] as string[]).concat(options.filter || []),
    });
  };
}
