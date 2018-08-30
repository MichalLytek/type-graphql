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
  const { options, returnTypeFunc } = getTypeDecoratorParams(returnTypeFuncOrOptions, maybeOptions);
  // const topics = ([] as string[]).concat(options.topics || []);
  return (prototype, methodName) => {
    const handler = getHandlerInfo(prototype, methodName, returnTypeFunc, options);
    if (!options.topics) {
      throw new MissingSubscriptionTopicsError(handler.target, handler.methodName);
    }
    if (Array.isArray(options.topics) && options.topics.length === 0) {
      throw new MissingSubscriptionTopicsError(handler.target, handler.methodName);
    }
    getMetadataStorage().collectSubscriptionHandlerMetadata({
      ...handler,
      topics: options.topics,
      filter: options.filter,
    });
  };
}
