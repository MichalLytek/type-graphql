---
title: Migration Guide
sidebar_label: v1.x -> v2.0
---

> This chapter contains migration guide, that will help you upgrade your codebase from using old Typegraphql `v1.x` into the newest `v2.0` release.
>
> If you just started using TypeGraphQL and you have `v2.0` installed, you can skip this chapter and go straight into the "Advanced guides" section.

## New `DateTimeISO` scalar name in schema

One of the breaking change released in `v2.0` is using `Date` scalars from `graphql-scalars` package, instead of custom ones that were built-in in TypegraphQL.

This means that the exported `GraphQLISODateTime` scalar is registered in schema under a changed name - `DateTimeISO`. If you don't plan to use other `DateTime` scalar in your project and you need to restore the existing scalar name for an easy upgrade to the latest TypeGraphQL version (without rewriting your GraphQL queries), here's a simple snippet for you to use.

First, you need to create an alias for the `GraphQLDateTimeISO` scalar:

```ts
import { GraphQLDateTimeISO } from "graphql-scalars";
import { GraphQLScalarType } from "graphql";

const AliasedGraphQLDateTimeISO = new GraphQLScalarType({
  ...GraphQLDateTimeISO.toConfig(),
  name: "DateTime", // use old name
});
```

And then register the scalars mapping in the schema you build, in order to overwrite the default date scalar:

```ts
import { buildSchema } from "type-graphql";

const schema = await buildSchema({
  resolvers,
  scalarsMap: [{ type: Date, scalar: AliasedGraphQLDateTimeISO }],
});
```

An alternative solution would be to just search for `DateTime` via CTRL+F in your codebase and replace with `DateTimeISO` in your queries, if you don't need the backward compatibility for existing released client apps.

## Subscriptions

The new `v2.0` release contains a bunch of breaking changes related to the GraphQL subscriptions feature.

In previous releases, this feature was build upon the [`graphql-subscriptions`](https://github.com/apollographql/graphql-subscriptions) package and it's `PubSub` system.
However, it's become unmaintained in the last years and some alternatives has been developed in the meantime.

So since `v2.0`, TypeGraphQL relies on the new [`@graphql-yoga/subscriptions`](https://the-guild.dev/graphql/yoga-server/docs/features/subscriptions) package which is built on top of latest ECMAScript features. It also has own `PubSub` implementation which works in a similar fashion, but has a slightly different API.

We did out best to hide under the hood all the differences between the APIs of those packages, but some breaking changes had to occurred in the TypeGraphQL API.

### The `pubSub` option of `buildSchema`

It is now required to pass the `PubSub` instance as the config option of `buildSchema` function.
Previously, you could omit it and rely on the default one created by TypeGraphQL.

The reason for this change is that `@graphql-yoga/subscriptions` package allows to create a type-safe `PubSub` instance via the [generic `createPubSub` function](https://the-guild.dev/graphql/yoga-server/v2/features/subscriptions#topics), so you can add type info about the topics and params required while using `.publish()` method.

Simple example of the new API:

```ts
import { buildSchema } from "type-graphql";
import { createPubSub } from "@graphql-yoga/subscriptions";

export const pubSub = createPubSub<{
  NOTIFICATIONS: [NotificationPayload];
  DYNAMIC_ID_TOPIC: [number, NotificationPayload];
}>();

const schema = await buildSchema({
  resolver,
  pubSub,
});
```

Be aware that you can use any `PubSub` system you want, not only the `graphql-yoga` one.
The only requirement is to comply with the exported `PubSub` interface - having proper `.subscribe()` and `.publish()` methods.

### No `@PubSub` decorator

The consequence of not having automatically created, default `PubSub` instance, is that you don't need access to the internally-created `PubSub` instance.

Hence, the `@PubSub` decorator was removed - please use dependency injection system if you don't want to have a hardcoded import. The corresponding `Publisher` type was also removed as it was not needed anymore.

### Renamed and removed types

There was some inconsistency in naming of the decorator option functions argument types, which was unified in the `v2.0` release.

If you reference those types in your code (`filter` or `subscribe` decorator option functions), make sure you update your type annotation and imports to the new name.

- `ResolverFilterData` -> `SubscriptionHandlerData`
- `ResolverTopicData` -> `SubscribeResolverData`

Also, apart from the `Publisher` type mentioned above, the `PubSubEngine` type has been removed and is no longer exported from the package.

### Topic with Dynamic ID

As TypeGraphQL uses `@graphql-yoga/subscriptions` under the hood, it also aims to use its features. And one of the extension to the old `PubSub` system used in `v1.x` is ability to not only use dynamic topics but a topic with a dynamic id.

You can read more about this new feature in [subscription docs](./subscriptions.md#topic-with-dynamic-id).
