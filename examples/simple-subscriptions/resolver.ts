import { PubSubEngine } from "graphql-subscriptions";
import { Resolver, Query, Mutation, Arg, PubSub, Publisher, Subscription, Root } from "../../src";

import { Notification, NotificationPayload } from "./notification.type";

enum Topic {
  Notifications = "NOTIFICATIONS",
}

@Resolver()
export class SampleResolver {
  private autoIncrement = 0;

  @Query(returns => Date)
  currentDate() {
    return new Date();
  }

  @Mutation()
  pubSubMutation(
    @PubSub() pubSub: PubSubEngine,
    @Arg("message", { nullable: true })
    message?: string,
  ): boolean {
    const payload: NotificationPayload = { id: ++this.autoIncrement, message };
    return pubSub.publish(Topic.Notifications, payload);
  }

  @Mutation()
  publisherMutation(
    @PubSub(Topic.Notifications) publish: Publisher<NotificationPayload>,
    @Arg("message", { nullable: true })
    message?: string,
  ): boolean {
    return publish({ id: ++this.autoIncrement, message });
  }

  @Subscription({ topics: Topic.Notifications })
  normalSubscription(@Root() { id, message }: NotificationPayload): Notification {
    return { id, message, date: new Date() };
  }

  @Subscription(returns => Notification, {
    topics: Topic.Notifications,
    filter: ({ root: { id } }) => id % 2 === 0,
  })
  subscriptionWithFilter(@Root() { id, message }: NotificationPayload) {
    const newNotification: Notification = { id, message, date: new Date() };
    return newNotification;
  }
}
