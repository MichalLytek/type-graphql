import { type ResolverFn } from "graphql-subscriptions";
import { MissingSubscriptionTopicsError } from "@/errors";
import { getTypeDecoratorParams } from "@/helpers/decorators";
import { getResolverMetadata } from "@/helpers/resolver-metadata";
import { getMetadataStorage } from "@/metadata/getMetadataStorage";
import { type MergeExclusive } from "@/typings";
import {
  type AdvancedOptions,
  type ReturnTypeFunc,
  type SubscriptionFilterFunc,
  type SubscriptionTopicFunc,
} from "./types";

interface PubSubOptions {
  topics: string | string[] | SubscriptionTopicFunc;
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
