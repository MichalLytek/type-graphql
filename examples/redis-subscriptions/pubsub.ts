import { createRedisEventTarget } from "@graphql-yoga/redis-event-target";
import { createPubSub } from "@graphql-yoga/subscription";
import { Redis } from "ioredis";
import { type NewCommentPayload } from "./comment.type";

export const enum Topic {
  NEW_COMMENT = "NEW_COMMENT",
}

export const pubSub = createPubSub<{
  [Topic.NEW_COMMENT]: [NewCommentPayload];
}>({
  eventTarget: createRedisEventTarget({
    publishClient: new Redis(process.env.REDIS_URL!, {
      retryStrategy: times => Math.max(times * 100, 3000),
    }),
    subscribeClient: new Redis(process.env.REDIS_URL!, {
      retryStrategy: times => Math.max(times * 100, 3000),
    }),
  }),
});
