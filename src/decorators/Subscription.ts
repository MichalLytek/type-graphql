import { ReturnTypeFunc, AdvancedOptions,
  SubscriptionFilterFunc, SubscriptionTopicFunc } from "./types";
import { getMetadataStorage } from "../metadata/getMetadataStorage";
import { getHandlerInfo } from "../helpers/handlers";
import { getTypeDecoratorParams } from "../helpers/decorators";
import { MissingSubscriptionTopicsError } from "../errors";

export interface SubscriptionOptions extends AdvancedOptions {
  topics: string | string[] | SubscriptionTopicFunc;
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
  // tslint:disable-next-line:max-line-length
  const { options, returnTypeFunc } = getTypeDecoratorParams(returnTypeFuncOrOptions, maybeOptions);
  return (prototype, methodName) => {
    const handler = getHandlerInfo(prototype, methodName, returnTypeFunc, options);
    const subscriptionOptions = options as SubscriptionOptions;
    if (Array.isArray(options.topics) && options.topics.length === 0) {
      throw new MissingSubscriptionTopicsError(handler.target, handler.methodName);
    }
    getMetadataStorage().collectSubscriptionHandlerMetadata({
      ...handler,
      topics: subscriptionOptions.topics,
      filter: subscriptionOptions.filter,
    });
  };
}
