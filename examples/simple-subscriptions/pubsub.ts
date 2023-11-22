import { createPubSub } from "@graphql-yoga/subscription";
import { type NotificationPayload } from "./notification.type";

export const pubSub = createPubSub<
  {
    NOTIFICATIONS: [NotificationPayload];
    DYNAMIC_ID_TOPIC: [number, NotificationPayload];
  } & Record<string, [NotificationPayload]> // fallback for dynamic topics
>();
