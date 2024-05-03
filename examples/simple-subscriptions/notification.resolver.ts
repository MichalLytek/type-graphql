import {
  Arg,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
  type SubscribeResolverData,
  Subscription,
  type SubscriptionHandlerData,
} from "type-graphql";
import { Notification, NotificationPayload } from "./notification.type";
import { Topic, pubSub } from "./pubsub";

@Resolver()
export class NotificationResolver {
  private id: number = 0;

  @Query(_returns => Date)
  currentDate() {
    return new Date();
  }

  @Mutation(_returns => Boolean)
  async pubSubMutation(@Arg("message", { nullable: true }) message?: string): Promise<boolean> {
    this.id += 1;
    const payload: NotificationPayload = { id: this.id, message };
    pubSub.publish(Topic.NOTIFICATIONS, payload);
    return true;
  }

  @Subscription({ topics: Topic.NOTIFICATIONS })
  normalSubscription(@Root() { id, message }: NotificationPayload): Notification {
    return { id, message, date: new Date() };
  }

  @Subscription(_returns => Notification, {
    topics: Topic.NOTIFICATIONS,
    filter: ({ payload }: SubscriptionHandlerData<NotificationPayload>) => payload.id % 2 === 0,
  })
  subscriptionWithFilter(@Root() { id, message }: NotificationPayload) {
    const newNotification: Notification = { id, message, date: new Date() };
    return newNotification;
  }

  // Multiple topics

  @Subscription(_returns => Notification, {
    topics: [Topic.NOTIFICATIONS, "NOTIFICATIONS_2"],
    filter: ({ payload }: SubscriptionHandlerData<NotificationPayload>) => payload.id % 2 === 0,
  })
  subscriptionWithMultipleTopics(@Root() { id, message }: NotificationPayload) {
    const newNotification: Notification = { id, message, date: new Date() };
    return newNotification;
  }

  // Dynamic topic

  @Mutation(() => Boolean)
  async publishToDynamicTopic(
    @Arg("topic") topic: string,
    @Arg("message", { nullable: true }) message?: string,
  ): Promise<boolean> {
    this.id += 1;
    const payload: NotificationPayload = { id: this.id, message };
    pubSub.publish(topic, payload);
    return true;
  }

  @Subscription({
    topics: ({ args }) => args.topic,
  })
  subscribeToTopicFromArg(
    @Arg("topic") _topic: string,
    @Root() { id, message }: NotificationPayload,
  ): Notification {
    return { id, message, date: new Date() };
  }

  // Dynamic topic id

  @Mutation(() => Boolean)
  async publishWithDynamicTopicId(
    @Arg("topicId", () => Int) topicId: number,
    @Arg("message", { nullable: true }) message?: string,
  ): Promise<boolean> {
    this.id += 1;
    const payload: NotificationPayload = { id: this.id, message };
    pubSub.publish(Topic.DYNAMIC_ID_TOPIC, topicId, payload);
    return true;
  }

  @Subscription({
    topics: Topic.DYNAMIC_ID_TOPIC,
    topicId: ({ args }: SubscribeResolverData<any, { topicId: number }, any>) => args.topicId,
  })
  subscribeToTopicIdFromArg(
    @Arg("topicId", () => Int) _topicId: number,
    @Root() { id, message }: NotificationPayload,
  ): Notification {
    return { id, message, date: new Date() };
  }
}
