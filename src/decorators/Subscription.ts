import { ResolverFn } from "graphql-subscriptions";

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
import { MergeExclusive } from "../utils/types";

interface PubSubOptions {
  topics: string | readonly string[] | SubscriptionTopicFunc;
  filter?: SubscriptionFilterFunc;
}

interface SubscribeOptions {
  subscribe: ResolverFn;
}

export type SubscriptionOptions = AdvancedOptions & MergeExclusive<PubSubOptions, SubscribeOptions>;

export function Subscription(options: SubscriptionOptions): MethodDecorator;
export function Subscription(
  returnTypeFunc: ReturnTypeFunc,
  options: SubscriptionOptions,
): MethodDecorator;
export function Subscription(
  returnTypeFuncOrOptions: ReturnTypeFunc | SubscriptionOptions,
  maybeOptions?: SubscriptionOptions,
): MethodDecorator {
  const params = getTypeDecoratorParams(returnTypeFuncOrOptions, maybeOptions);
  const options = params.options as SubscriptionOptions;
  return (prototype, methodName) => {
    const metadata = getResolverMetadata(prototype, methodName, params.returnTypeFunc, options);
    if (Array.isArray(options.topics) && options.topics.length === 0) {
      throw new MissingSubscriptionTopicsError(metadata.target, metadata.methodName);
    }
    getMetadataStorage().collectSubscriptionHandlerMetadata({
      ...metadata,
      topics: options.topics,
      filter: options.filter,
      subscribe: options.subscribe,
    });
  };
}
