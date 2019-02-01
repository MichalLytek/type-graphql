import {
  ReturnTypeFunc,
  AdvancedOptions,
  SubscriptionFilterFunc,
  SubscriptionTopicFunc,
} from "./types";
import { getMetadataStorage } from "../metadata/getMetadataStorage";
import { getResolverMetadata } from "../helpers/resolver-metadata";
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
  const { options, returnTypeFunc } = getTypeDecoratorParams(returnTypeFuncOrOptions, maybeOptions);
  return (prototype, methodName) => {
    const metadata = getResolverMetadata(prototype, methodName, returnTypeFunc, options);
    const subscriptionOptions = options as SubscriptionOptions;
    if (Array.isArray(options.topics) && options.topics.length === 0) {
      throw new MissingSubscriptionTopicsError(metadata.target, metadata.methodName);
    }
    getMetadataStorage().collectSubscriptionHandlerMetadata({
      ...metadata,
      topics: subscriptionOptions.topics,
      filter: subscriptionOptions.filter,
    });
  };
}
