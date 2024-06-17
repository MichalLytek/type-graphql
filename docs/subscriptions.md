---
title: Subscriptions
---

GraphQL can be used to perform reads with queries and writes with mutations.
However, oftentimes clients want to get updates pushed to them from the server when data they care about changes.
To support that, GraphQL has a third operation: subscription. TypeGraphQL of course has great support for subscription, using the [`@graphql-yoga/subscription`](https://the-guild.dev/graphql/yoga-server/docs/features/subscriptions) package created by [`The Guild`](https://the-guild.dev/).

## Creating Subscriptions

Subscription resolvers are similar to [queries and mutation resolvers](./resolvers.md) but slightly more complicated.

First we create a normal class method as always, but this time annotated with the `@Subscription()` decorator.

```ts
class SampleResolver {
  // ...
  @Subscription()
  newNotification(): Notification {
    // ...
  }
}
```

Then we have to provide the topics we wish to subscribe to. This can be a single topic string, an array of topics or a function to dynamically create a topic based on subscription arguments passed to the query. We can also use TypeScript enums for enhanced type safety.

```ts
class SampleResolver {
  // ...
  @Subscription({
    topics: "NOTIFICATIONS", // Single topic
    topics: ["NOTIFICATIONS", "ERRORS"] // Or topics array
    topics: ({ args, context }) => args.topic // Or dynamic topic function
  })
  newNotification(): Notification {
    // ...
  }
}
```

We can also provide the `filter` option to decide which topic events should trigger our subscription.
This function should return a `boolean` or `Promise<boolean>` type.

```ts
class SampleResolver {
  // ...
  @Subscription({
    topics: "NOTIFICATIONS",
    filter: ({ payload, args }) => args.priorities.includes(payload.priority),
  })
  newNotification(): Notification {
    // ...
  }
}
```

We can also provide a custom subscription logic which might be useful, e.g. if we want to use the Prisma subscription functionality or something similar.

All we need to do is to use the `subscribe` option which should be a function that returns an `AsyncIterable` or a `Promise<AsyncIterable>`. Example using Prisma 1 subscription feature:

```ts
class SampleResolver {
  // ...
  @Subscription({
    subscribe: ({ root, args, context, info }) => {
      return context.prisma.$subscribe.users({ mutation_in: [args.mutationType] });
    },
  })
  newNotification(): Notification {
    // ...
  }
}
```

> Be aware that we can't mix the `subscribe` option with the `topics` and `filter` options. If the filtering is still needed, we can use the [`filter` and `map` helpers](https://the-guild.dev/graphql/yoga-server/docs/features/subscriptions#filter-and-map-values) from the `@graphql-yoga/subscription` package.

Now we can implement the subscription resolver. It will receive the payload from a triggered topic of the pubsub system using the `@Root()` decorator. There, we can transform it to the returned shape.

```ts
class SampleResolver {
  // ...
  @Subscription({
    topics: "NOTIFICATIONS",
    filter: ({ payload, args }) => args.priorities.includes(payload.priority),
  })
  newNotification(
    @Root() notificationPayload: NotificationPayload,
    @Args() args: NewNotificationsArgs,
  ): Notification {
    return {
      ...notificationPayload,
      date: new Date(),
    };
  }
}
```

## Triggering subscription topics

Ok, we've created subscriptions, but what is the `pubsub` system and how do we trigger topics?

They might be triggered from external sources like a database but also in mutations,
e.g. when we modify some resource that clients want to receive notifications about when it changes.

So, let us assume we have this mutation for adding a new comment:

```ts
class SampleResolver {
  // ...
  @Mutation(returns => Boolean)
  async addNewComment(@Arg("comment") input: CommentInput) {
    const comment = this.commentsService.createNew(input);
    await this.commentsRepository.save(comment);
    return true;
  }
}
```

First, we need to create the `PubSub` instance. In most cases, we call `createPubSub()` function from `@graphql-yoga/subscription` package. Optionally, we can define the used topics and payload type using the type argument, e.g.:

```ts
import { createPubSub } from "@graphql-yoga/subscription";

export const pubSub = createPubSub<{
  NOTIFICATIONS: [NotificationPayload];
  DYNAMIC_ID_TOPIC: [number, NotificationPayload];
}>();
```

Then, we need to register the `PubSub` instance in the `buildSchema()` function options:

```ts
import { buildSchema } from "type-graphql";
import { pubSub } from "./pubsub";

const schema = await buildSchema({
  resolver,
  pubSub,
});
```

Finally, we can use the created `PubSub` instance to trigger the topics and send the payload to all topic subscribers:

```ts
import { pubSub } from "./pubsub";

class SampleResolver {
  // ...
  @Mutation(returns => Boolean)
  async addNewComment(@Arg("comment") input: CommentInput, @PubSub() pubSub: PubSubEngine) {
    const comment = this.commentsService.createNew(input);
    await this.commentsRepository.save(comment);
    // Trigger subscriptions topics
    const payload: NotificationPayload = { message: input.content };
    pubSub.publish("NOTIFICATIONS", payload);
    return true;
  }
}
```

And that's it! Now all subscriptions attached to the `NOTIFICATIONS` topic will be triggered when performing the `addNewComment` mutation.

## Topic with dynamic ID

The idea of this feature is taken from the `@graphql-yoga/subscription` that is used under the hood.
Basically, sometimes you only want to emit and listen for events for a specific entity (e.g. user or product). Dynamic topic ID lets you declare topics scoped to a special identifier, e.g.:

```ts
@Resolver()
class NotificationResolver {
  @Subscription({
    topics: "NOTIFICATIONS",
    topicId: ({ context }) => context.userId,
  })
  newNotification(@Root() { message }: NotificationPayload): Notification {
    return { message, date: new Date() };
  }
}
```

Then in your mutation or services, you need to pass the topic id as the second parameter:

```ts
pubSub.publish("NOTIFICATIONS", userId, { id, message });
```

> Be aware that this feature must be supported by the pubsub system of your choice.
> If you decide to use something different than `createPubSub()` from `@graphql-yoga/subscription`, the second argument might be treated as a payload, not dynamic topic id.

## Using a custom PubSub system

While TypeGraphQL uses the `@graphql-yoga/subscription` package under the hood to handle subscription, there's no requirement to use that implementation of `PubSub`.

In fact, you can use any pubsub system you want, not only the `graphql-yoga` one.
The only requirement is to comply with the exported `PubSub` interface - having proper `.subscribe()` and `.publish()` methods.

This is especially helpful for production usage, where we can't rely on the in-memory event emitter, so that we [use distributed pubsub](https://the-guild.dev/graphql/yoga-server/docs/features/subscriptions#distributed-pubsub-for-production).

## Creating a Subscription Server

The [bootstrap guide](./bootstrap.md) and all the earlier examples used [`apollo-server`](https://github.com/apollographql/apollo-server) to create an HTTP endpoint for our GraphQL API.

However, beginning in Apollo Server 3, subscriptions are not supported by the "batteries-included" apollo-server package. To enable subscriptions, you need to follow the guide on their docs page:
<https://www.apollographql.com/docs/apollo-server/data/subscriptions/#enabling-subscriptions>

## Examples

See how subscriptions work in a [simple example](https://github.com/MichalLytek/type-graphql/tree/master/examples/simple-subscriptions). You can see there, how simple is setting up GraphQL subscriptions using `graphql-yoga` package.

For production usage, it's better to use something more scalable like a Redis-based pubsub system - [a working example is also available](https://github.com/MichalLytek/type-graphql/tree/master/examples/redis-subscriptions).
However, to launch this example you need to have a running instance of Redis and you might have to modify the example code to provide your connection parameters.
