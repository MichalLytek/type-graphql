import { PubSubEngine } from "graphql-subscriptions";
import {
  Arg,
  Mutation,
  PubSub,
  Publisher,
  Query,
  Resolver,
  type ResolverFilterData,
  Root,
  Subscription,
} from "type-graphql";
import { Notification, NotificationPayload } from "./notification.type";

@Resolver()
export class SampleResolver {
  private id = 0;

  @Query(_returns => Date)
  currentDate() {
    return new Date();
  }

  @Mutation(_returns => Boolean)
  async pubSubMutation(
    @PubSub() pubSub: PubSubEngine,
    @Arg("message", { nullable: true }) message?: string,
  ): Promise<boolean> {
    this.id += 1;
    const payload: NotificationPayload = { id: this.id, message };
    await pubSub.publish("NOTIFICATIONS", payload);
    return true;
  }

  @Mutation(_returns => Boolean)
  async publisherMutation(
    @PubSub("NOTIFICATIONS") publish: Publisher<NotificationPayload>,
    @Arg("message", { nullable: true }) message?: string,
  ): Promise<boolean> {
    this.id += 1;
    await publish({ id: this.id, message });
    return true;
  }

  @Subscription({ topics: "NOTIFICATIONS" })
  normalSubscription(@Root() { id, message }: NotificationPayload): Notification {
    return { id, message, date: new Date() };
  }

  @Subscription(_returns => Notification, {
    topics: "NOTIFICATIONS",
    filter: ({ payload }: ResolverFilterData<NotificationPayload>) => payload.id % 2 === 0,
  })
  subscriptionWithFilter(@Root() { id, message }: NotificationPayload) {
    const newNotification: Notification = { id, message, date: new Date() };
    return newNotification;
  }

  // Dynamic topic

  @Mutation(() => Boolean)
  async pubSubMutationToDynamicTopic(
    @PubSub() pubSub: PubSubEngine,
    @Arg("topic") topic: string,
    @Arg("message", { nullable: true }) message?: string,
  ): Promise<boolean> {
    this.id += 1;
    const payload: NotificationPayload = { id: this.id, message };
    await pubSub.publish(topic, payload);
    return true;
  }

  @Subscription({
    topics: ({ args }) => args.topic,
  })
  subscriptionWithFilterToDynamicTopic(
    @Arg("topic") _topic: string,
    @Root() { id, message }: NotificationPayload,
  ): Notification {
    return { id, message, date: new Date() };
  }
}
