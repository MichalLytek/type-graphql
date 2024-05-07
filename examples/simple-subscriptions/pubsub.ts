import { createPubSub } from "@graphql-yoga/subscription";
import { type NotificationPayload } from "./notification.type";

export const enum Topic {
  NOTIFICATIONS = "NOTIFICATIONS",
  DYNAMIC_ID_TOPIC = "DYNAMIC_ID_TOPIC",
}

export const pubSub = createPubSub<
  {
    [Topic.NOTIFICATIONS]: [NotificationPayload];
    [Topic.DYNAMIC_ID_TOPIC]: [number, NotificationPayload];
  } & Record<string, [NotificationPayload]> // Fallback for dynamic topics
>();
