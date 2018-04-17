import { ReturnTypeFunc, AdvancedOptions, SubscriptionFilterFunc } from "../types/decorators";
import { MetadataStorage } from "../metadata/metadata-storage";
import { getHandlerInfo } from "../helpers/handlers";
import { getTypeDecoratorParams } from "../helpers/decorators";
import { MissingSubscriptionTopicsError } from "../errors";

export interface SubscriptionOptions extends AdvancedOptions {
  topics: string | string[];
  filter?: SubscriptionFilterFunc;
}

export function Subscription(options: SubscriptionOptions): MethodDecorator;
export function Subscription(
  returnTypeFunc: ReturnTypeFunc,
  options: SubscriptionOptions,
): MethodDecorator;
export function Subscription(
  returnTypeFuncOrOptions: ReturnTypeFunc | SubscriptionOptions,
  maybeOptions?: SubscriptionOptions,
): MethodDecorator {
  const { options, returnTypeFunc } = getTypeDecoratorParams(returnTypeFuncOrOptions, maybeOptions);
  const topics = ([] as string[]).concat(options.topics || []);
  return (prototype, methodName) => {
    const handler = getHandlerInfo(prototype, methodName, returnTypeFunc, options);
    if (topics.length === 0) {
      throw new MissingSubscriptionTopicsError(handler.target, handler.methodName);
    }
    MetadataStorage.collectSubscriptionHandlerMetadata({
      ...handler,
      topics,
      filter: options.filter,
    });
  };
}
