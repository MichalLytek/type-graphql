import { ReturnTypeFunc, AdvancedOptions, SubscriptionFilterFunc } from "../types/decorators";
import { MetadataStorage } from "../metadata/metadata-storage";
import { getHandlerInfo } from "../helpers/handlers";
import { getTypeDecoratorParams } from "../helpers/decorators";
import { ActionData } from "../types";

export interface SubscriptionOptions extends AdvancedOptions {
  topics?: string | string[];
  filter?: SubscriptionFilterFunc;
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
      topics: ([] as string[]).concat(options.topics || []),
      filter: options.filter,
    });
  };
}
