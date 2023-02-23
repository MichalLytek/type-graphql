---
title: Subscriptions
id: version-0.16.0-subscriptions
original_id: subscriptions
---

GraphQL can be used to perform reads with queries, and to perform writes with mutations.
However, oftentimes clients want to get pushed updates from the server when data they care about changes.
To support that, GraphQL has a third operation: subscription. TypeGraphQL of course has great support for subscription, using [graphql-subscriptions](https://github.com/apollographql/graphql-subscriptions) package created by [Apollo GraphQL](https://www.apollographql.com/).

## Creating subscriptions

Subscription resolvers are basically similar to [queries and mutation resolvers](resolvers.md) but a little bit more complicated.

At first, we create normal class method as always, this time annotated with `@Subscription()` decorator.

```typescript
class SampleResolver {
  // ...
  @Subscription()
  newNotification(): Notification {
    // ...
  }
}
```

Then we have to provide to which topics we want to subscribe. This can be a single topic string, an array of topics or a function to dynamically create a topic based on subscription args passed on the query. We can also use TS enums for enhanced type safety.

```typescript
class SampleResolver {
  // ...
  @Subscription({
    topics: "NOTIFICATIONS", // single topic
    topics: ["NOTIFICATIONS", "ERRORS"] // or topics array
    topics: ({ args, payload, context }) => args.topic // or dynamic topic function
  })
  newNotification(): Notification {
    // ...
  }
}
```

We can also provide the `filter` option to decide which events from topics should trigger our subscription.
This function should return `boolean` or `Promise<boolean>`.

```typescript
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

Then we can implement the subscription resolver. It will receive the payload from triggered topic of pubsub system using `@Root()` decorator. There we can transform it to the returned shape.

```typescript
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

## Triggering subscriptions topics

Ok, we've created subscriptions, but what is the `pubsub` system and how to trigger the topics?

They might be triggered from external sources like a DB. We also can do this in mutations,
e.g. when we modify some resource that clients want to receive notifications about the changes.

So, assuming we have this mutation for adding new comment:

```typescript
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

We use `@PubSub()` decorator to inject the `pubsub` into our method params.
There we can trigger the topics and send the payload to all topic subscribers.

```typescript
class SampleResolver {
  // ...
  @Mutation(returns => Boolean)
  async addNewComment(@Arg("comment") input: CommentInput, @PubSub() pubSub: PubSubEngine) {
    const comment = this.commentsService.createNew(input);
    await this.commentsRepository.save(comment);
    // here we can trigger subscriptions topics
    const payload: NotificationPayload = { message: input.content };
    await pubSub.publish("NOTIFICATIONS", payload);
    return true;
  }
}
```

For easier testability (easier mocking/stubbing), we can also inject only the `publish` method bound to selected topic.
To do this, we use `@PubSub("TOPIC_NAME")` decorator and the `Publisher<TPayload>` type:

```typescript
class SampleResolver {
  // ...
  @Mutation(returns => Boolean)
  async addNewComment(
    @Arg("comment") input: CommentInput,
    @PubSub("NOTIFICATIONS") publish: Publisher<NotificationPayload>,
  ) {
    const comment = this.commentsService.createNew(input);
    await this.commentsRepository.save(comment);
    // here we can trigger subscriptions topics
    await publish({ message: input.content });
    return true;
  }
}
```

And that's it! Now all subscriptions attached to `NOTIFICATIONS` topic will be triggered while performing `addNewComment` mutation.

## Using custom PubSub system

By default, TypeGraphQL use simple `PubSub` system from `grapqhl-subscriptions` which is based on EventEmitter.
This solution has a big drawback that it will works correctly only when we have single instance (process) of our Node.js app.

For better scalability you'll want to use one of the [PubSub implementations](<(https://github.com/apollographql/graphql-subscriptions#pubsub-implementations)>) backed by an external store.
It might be e.g. Redis with [`graphql-redis-subscriptions`](https://github.com/davidyaha/graphql-redis-subscriptions) package.

All you need to do is to create an instance of PubSub according to package instruction and the provide it to TypeGraphQL `buildSchema` options:

```typescript
const myRedisPubSub = getConfiguredRedisPubSub();

const schema = await buildSchema({
  resolvers: [__dirname + "/**/*.resolver.ts"],
  pubSub: myRedisPubSub,
});
```

## Creating subscription server

The [bootstrap guide](bootstrap.md) and all the earlier examples used [`apollo-server`](https://github.com/apollographql/apollo-server) to create HTTP endpoint for our GraphQL API.

Fortunately, to make subscriptions work, we don't need to manually provide transport layer that doesn't have constraints of HTTP and can do a push-based communication (WebSockets).
The `apollo-server` package has built-in subscriptions support using websockets, so it's working out of the box without any changes to our bootstrap config. However, if we want, we can provide the `subscriptions` property of config object:

```typescript
// Create GraphQL server
const server = new ApolloServer({
  schema,
  subscriptions: {
    path: "/subscriptions",
    // other options and hooks, like `onConnect`
  },
});
```

And it's done!. We have a working GraphQL subscription server on `/subscriptions`, along with a normal HTTP GraphQL server.

## Examples

You can see how the subscriptions works in a [simple example](https://github.com/MichalLytek/type-graphql/tree/v0.16.0/examples/simple-subscriptions).

For production usage, it's better to use something more scalable, e.g. a Redis-based pubsub system - [working example is also available](https://github.com/MichalLytek/type-graphql/tree/v0.16.0/examples/redis-subscriptions).
However, to launch this example you need to have a running instance of Redis and you might have to modify the example code to provide your connection params.
