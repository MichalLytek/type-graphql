---
title: Announcing TypeGraphQL 2.0 🚀
author: Michał Lytek
authorURL: https://github.com/MichalLytek
authorImageURL: /img/author.jpg
---

It's finally happening! After a long journey through multiple betas and release candidates, TypeGraphQL `v2.0` is now stable 🎉

A lot has changed in the Node.js world since the [1.0 release](./2020-08-19-devto-article.md) — ESM became a real thing, `graphql-subscriptions` got abandoned, and the ecosystem moved forward. This release catches up with all of that while keeping the same decorator-based approach we all know and love.

Well, then, without further ado... let's take a look what TypeGraphQL 2.0 brings us!

- [Modern subscriptions engine](#modern-subscriptions-engine)
- [Class-based auth checker](#class-based-auth-checker)
- [Validation rework](#validation-rework)
- [Custom decorators](#custom-decorators)
- [ESM support](#esm-support)
- [Scalars from the ecosystem](#scalars-from-the-ecosystem)
- [GraphQL-native error handling](#graphql-native-error-handling)
- [Performance and build improvements](#performance-and-build-improvements)
- [Migration guide](#migration-guide)
- [What's next?](#whats-next)

<!--truncate-->

## Modern subscriptions engine

One of the biggest changes in 2.0 is the subscriptions system. The old [`graphql-subscriptions`](https://github.com/apollographql/graphql-subscriptions) package had become unmaintained, so we migrated to [`@graphql-yoga/subscriptions`](https://the-guild.dev/graphql/yoga-server/docs/features/subscriptions) — a modern, actively maintained alternative built on top of the latest ECMAScript features.

The new PubSub system is type-safe out of the box. You define your topic types once, and TypeScript makes sure you publish the right payload to the right topic:

```ts
import { createPubSub } from "@graphql-yoga/subscriptions";

export const pubSub = createPubSub<{
  NOTIFICATIONS: [NotificationPayload];
  NEW_COMMENT: [number, CommentPayload]; // topic with dynamic ID
}>();
```

The `pubSub` instance is now passed directly to `buildSchema` instead of being auto-created internally, and the old `@PubSub` decorator has been removed in favor of direct imports. We also added support for **topic with dynamic ID** — a powerful feature that lets you subscribe to specific entity changes (e.g. comments on a specific post).

The subscription system is not tied to any specific server — you can use it with Apollo Server, GraphQL Yoga, or any other GraphQL server that supports subscriptions. And if the built-in PubSub doesn't meet your needs, you can provide your own implementation as long as it matches the `PubSub` interface. There's even a [Redis subscriptions example](https://github.com/MichalLytek/type-graphql/tree/master/examples/redis-subscriptions) in the repo for distributed setups.

## Class-based auth checker

One of the most requested features was the ability to use dependency injection in auth checkers. In 1.x, the `authChecker` option only accepted a plain function, which made it awkward to access services or repositories.

Now in 2.0, the `authChecker` option also supports **class-based auth checkers** — your auth checker can receive injected services just like your resolvers:

```ts
import { type AuthCheckerInterface, type ResolverData } from "type-graphql";

class CustomAuthChecker implements AuthCheckerInterface<Context> {
  constructor(private readonly userService: UserService) {}

  check({ context }: ResolverData<Context>, roles: string[]) {
    const user = this.userService.getByToken(context.token);
    if (!user) return false;
    return roles.length === 0 || roles.includes(user.role);
  }
}
```

We also added support for applying `@Authorized()` at the **resolver class level**, so you can protect all queries and mutations in a resolver with a single decorator instead of annotating each handler individually.

The old `UnauthorizedError` and `ForbiddenError` classes have been replaced with `AuthenticationError` and `AuthorizationError` that properly extend `GraphQLError` — more on that in the [error handling section](#graphql-native-error-handling).

## Validation rework

The validation system got a pretty big rework:

**Validation is now opt-in.** The `validate` option defaults to `false`, and `class-validator` became an optional peer dependency. If you don't use validation, you don't need to install it at all. If you do, just set `validate: true` in `buildSchema`.

**Custom validation functions** have their own dedicated `validateFn` option (instead of overloading `validate`). The `ValidatorFn` signature also changed — it now receives the full resolver data (`argValue`, `argType`, and `{ root, args, context, info }`), so you can do things like context-aware validation.

**Per-argument validation** is also new — you can pass `validateFn` directly on `@Arg()` and `@Args()` decorators to validate individual arguments differently.

## Custom decorators

The custom decorator API got some attention too. First, some renames — `createMethodDecorator` is now `createMethodMiddlewareDecorator` and `createParamDecorator` is now `createParameterDecorator`. The old names were a bit misleading about what they actually did.

There's also a new `createResolverClassMiddlewareDecorator` that lets you apply middleware to **all handlers in a resolver class** at once — handy for logging, metrics, that sort of thing.

But the most interesting addition is that `createParameterDecorator` now accepts `CustomParameterOptions` with an `arg` property, so your custom decorator can also **register a GraphQL argument in the schema**:

```ts
function CurrentPage() {
  return createParameterDecorator(
    ({ args }) => args.page,
    {
      arg: {
        name: "page",
        typeFunc: () => Int,
        options: { defaultValue: 1 },
      },
    },
  );
}

// Usage in resolver:
@Query(() => [Recipe])
recipes(@CurrentPage() page: number) { ... }
```

## ESM support

TypeGraphQL 2.0 ships both CommonJS and ESM bundles. If your project uses `"type": "module"` in `package.json`, it should just work — no extra config needed.

There's also a new `type-graphql/shim` entry point for browser/frontend usage (e.g. sharing types between server and client) where `reflect-metadata` isn't available. It exports no-op decorators so TypeScript stays happy without pulling in the full runtime.

## Scalars from the ecosystem

Rather than maintaining our own date scalar implementations, TypeGraphQL 2.0 uses the [`graphql-scalars`](https://the-guild.dev/graphql/scalars) package from The Guild.

The `graphql-scalars` package is now a required peer dependency, and the exported `GraphQLISODateTime` scalar is actually a re-export of `GraphQLDateTimeISO`. The old `dateScalarMode` option has been removed in favor of the more flexible `scalarsMap` approach:

```ts
import { GraphQLTimestamp } from "graphql-scalars";

const schema = await buildSchema({
  resolvers,
  scalarsMap: [{ type: Date, scalar: GraphQLTimestamp }],
});
```

One thing to be aware of: the default date scalar is now registered in the schema as `DateTimeISO` instead of `DateTime`. Check the [migration guide](https://typegraphql.com/docs/migration-guide) for a simple snippet to restore the old name if needed.

## GraphQL-native error handling

All TypeGraphQL error classes now properly extend `GraphQLError` from the `graphql` package, with structured error information in the standard `extensions` property:

| Error class               | `extensions.code`   | Purpose                   |
| ------------------------- | ------------------- | ------------------------- |
| `AuthenticationError`     | `"UNAUTHENTICATED"` | User not authenticated    |
| `AuthorizationError`      | `"UNAUTHORIZED"`    | User lacks required roles |
| `ArgumentValidationError` | `"BAD_USER_INPUT"`  | Input validation failed   |

Error details like validation errors are now accessible through `error.extensions.validationErrors` instead of custom properties. This plays nicely with Apollo Server's `formatError`, GraphQL Yoga's `maskError`, and other server error handling mechanisms.

## Performance and build improvements

Some things worth mentioning under the hood:

- **HashMap-based metadata caching** for O(1) lookups during schema building, replacing O(n) scans. Makes a real difference if you build multiple schemas or have a large codebase.
- **`buildSchemaSync` now validates** the generated schema via introspection — no more silently producing invalid schemas that blow up at query time.
- **ES2021 build target** and **Node.js >= 20.11.1** required — we dropped older runtimes to keep things simple.

## Migration guide

There's a lot of breaking changes in a major release like this, so we wrote a proper [migration guide](https://typegraphql.com/docs/migration-guide) with before/after code examples for each one. If you're upgrading from v1.x, start there.

The TL;DR: update peer deps, turn on validation explicitly if you use it, rename a few imports, and switch your PubSub setup if you use subscriptions.

```sh
npm install type-graphql graphql@^16.12.0 graphql-scalars@^1.25.0
```

## What's next?

With 2.0 out, here's what's on the radar:

- Support for the [TC39 decorators proposal](https://github.com/tc39/proposal-decorators) as it stabilizes in TypeScript
- More examples and better docs
- Continued performance work

Thanks to everyone who tested the betas and RCs, reported bugs, and submitted PRs — this release is as much yours as it is ours 💪

If TypeGraphQL is useful to you, consider [starring the repo](https://github.com/MichalLytek/type-graphql) ⭐ or [becoming a sponsor](https://github.com/sponsors/MichalLytek) to keep the project going 😉
