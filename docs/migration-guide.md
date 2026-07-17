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

## Resolver loading

Support for loading resolvers by glob path strings has been removed in `v2.0`.

Previously, you could pass glob patterns to the `resolvers` option:

```ts
const schema = await buildSchema({
  resolvers: [__dirname + "/resolvers/**/*.ts"],
});
```

This is no longer supported. You must now pass an array of resolver class references:

```ts
import { RecipeResolver } from "./resolvers/recipe-resolver";
import { UserResolver } from "./resolvers/user-resolver";

const schema = await buildSchema({
  resolvers: [RecipeResolver, UserResolver],
});
```

The glob path approach was removed because it relied on dynamic `require` calls that don't work well with modern compilers, bundlers, and ESM. It also caused confusion with needing different file extensions for development vs production, and was the root cause of the old `isAbstract` decorator option (which has also been removed).

## Authorization system

### `AuthChecker` type change

The `AuthChecker` type is now a union of a function or a class, in order to support class-based auth checkers with dependency injection.

If you reference `AuthChecker` as a type annotation where only the function form is expected, update your code to use `AuthCheckerFn` instead:

```ts
// Before (v1.x)
import { AuthChecker } from "type-graphql";

const authChecker: AuthChecker<MyContext> = ({ context }, roles) => {
  return context.user !== undefined;
};

// After (v2.0) - if you need the function-only type
import { AuthCheckerFn } from "type-graphql";

const authChecker: AuthCheckerFn<MyContext> = ({ context }, roles) => {
  return context.user !== undefined;
};
```

Note that passing a function to the `authChecker` option of `buildSchema` still works the same way — this change only affects code that uses the `AuthChecker` type directly as a type annotation.

### New class-based auth checker

`v2.0` introduces support for class-based auth checkers via the `AuthCheckerInterface`. This enables dependency injection for auth logic:

```ts
import { type AuthCheckerInterface, type ResolverData } from "type-graphql";

class CustomAuthChecker implements AuthCheckerInterface<MyContext> {
  check({ context }: ResolverData<MyContext>, roles: string[]) {
    return context.user !== undefined;
  }
}

const schema = await buildSchema({
  resolvers,
  authChecker: CustomAuthChecker,
});
```

You can also now apply `@Authorized()` at the resolver class level, which will protect all queries, mutations, and subscriptions defined in that resolver. Read more in the [authorization docs](./authorization.md).

### Removed error classes

The `UnauthorizedError` and `ForbiddenError` classes have been removed and replaced with new error classes that extend `GraphQLError`:

- `UnauthorizedError` → `AuthenticationError` (with `extensions.code: "UNAUTHENTICATED"`)
- `ForbiddenError` → `AuthorizationError` (with `extensions.code: "UNAUTHORIZED"`)

If you imported these errors in your code, update the imports:

```ts
// Before (v1.x)
import { UnauthorizedError, ForbiddenError } from "type-graphql";

// After (v2.0)
import { AuthenticationError, AuthorizationError } from "type-graphql";
```

## Validation system

### Validation disabled by default

In `v1.x`, integration with `class-validator` was enabled by default. In `v2.0`, the `validate` option of `buildSchema` is set to `false` by default.

If your project relies on automatic argument validation, you need to explicitly enable it:

```ts
const schema = await buildSchema({
  resolvers,
  validate: true,
});
```

### `class-validator` is now optional

Since validation is disabled by default, `class-validator` is now an optional peer dependency. You only need to install it if you set `validate: true`:

```sh
npm install class-validator
```

### Custom validation function

The `validate` option of `buildSchema` no longer accepts a custom validation function. Use the new `validateFn` option instead:

```ts
// Before (v1.x)
const schema = await buildSchema({
  resolvers,
  validate: myCustomValidationFn,
});

// After (v2.0)
const schema = await buildSchema({
  resolvers,
  validateFn: myCustomValidationFn,
});
```

### `ValidatorFn` signature change

The `ValidatorFn` type signature has changed. Previously it was generic over the args type and received only the args value. Now it is generic over the context type and receives three arguments — the argument value, the argument type, and the full resolver data:

```ts
// Before (v1.x)
type ValidatorFn<TArgs = object> = (args: TArgs) => void | Promise<void>;

// After (v2.0)
type ValidatorFn<TContext extends object = object> = (
  argValue: any | undefined,
  argType: TypeValue,
  resolverData: ResolverData<TContext>,
) => void | Promise<void>;
```

This gives custom validation functions access to the full resolver context (`root`, `args`, `context`, `info`).

### Per-argument validation

You can now also pass a custom `validateFn` directly on `@Arg()` and `@Args()` decorators, for fine-grained per-argument validation:

```ts
@Query(() => [Recipe])
async recipes(
  @Args({ validateFn: myCustomValidation }) args: GetRecipesArgs,
) {
  // ...
}
```

### `ArgumentValidationError` changes

`ArgumentValidationError` now extends `GraphQLError` with structured error details in the `extensions` property:

```json
{
  "errors": [
    {
      "message": "Argument Validation Error",
      "extensions": {
        "code": "BAD_USER_INPUT",
        "validationErrors": [...]
      }
    }
  ]
}
```

If you were previously accessing `error.validationErrors` directly, update your code to access `error.extensions.validationErrors` instead.

## Error classes

All TypeGraphQL error classes now extend `GraphQLError` from the `graphql` package, with error codes in the `extensions` property.

Summary of error class changes:

| v1.x                      | v2.0                      | `extensions.code`   |
| ------------------------- | ------------------------- | ------------------- |
| `UnauthorizedError`       | `AuthenticationError`     | `"UNAUTHENTICATED"` |
| `ForbiddenError`          | `AuthorizationError`      | `"UNAUTHORIZED"`    |
| `ArgumentValidationError` | `ArgumentValidationError` | `"BAD_USER_INPUT"`  |

All error details that were previously direct properties on the error objects are now accessible through the standard `extensions` property. For production usage, you can use your server's error formatting mechanism (e.g. Apollo's `formatError` or Yoga's `maskError`) to filter sensitive information.

## Scalars and date handling

### `dateScalarMode` removed

The `dateScalarMode` option has been removed from `buildSchema`. In `v1.x`, you could toggle between ISO string and Unix timestamp formats:

```ts
// Before (v1.x) - no longer works
const schema = await buildSchema({
  resolvers,
  dateScalarMode: "timestamp",
});
```

Instead, use the `scalarsMap` option to explicitly map `Date` to the scalar you want:

```ts
// After (v2.0) - use scalarsMap
import { GraphQLTimestamp } from "graphql-scalars";

const schema = await buildSchema({
  resolvers,
  scalarsMap: [{ type: Date, scalar: GraphQLTimestamp }],
});
```

### `graphql-scalars` is a peer dependency

Date scalars are now provided by the `graphql-scalars` package rather than being built-in. This package must be installed as a peer dependency:

```sh
npm install graphql-scalars
```

The exported `GraphQLISODateTime` from `type-graphql` is now a re-export of `GraphQLDateTimeISO` from `graphql-scalars`. See the [DateTimeISO section](#new-datetimeiso-scalar-name-in-schema) above for details on handling the scalar name change.

## Custom decorators API

### Renamed functions

Two decorator factory functions have been renamed for clarity:

- `createMethodDecorator` → `createMethodMiddlewareDecorator`
- `createParamDecorator` → `createParameterDecorator`

Update your imports accordingly:

```ts
// Before (v1.x)
import { createMethodDecorator, createParamDecorator } from "type-graphql";

// After (v2.0)
import { createMethodMiddlewareDecorator, createParameterDecorator } from "type-graphql";
```

### New class-level middleware decorator

A new `createResolverClassMiddlewareDecorator` function has been added. It allows creating custom decorators that apply middleware to all handlers in a resolver class:

```ts
import { createResolverClassMiddlewareDecorator } from "type-graphql";

const LogAccess = createResolverClassMiddlewareDecorator(async ({ info }, next) => {
  console.log(`Accessed: ${info.parentType.name}.${info.fieldName}`);
  return next();
});

@LogAccess
@Resolver()
class RecipeResolver {
  // all queries and mutations in this resolver will be logged
}
```

### Custom parameter decorators with schema arguments

`createParameterDecorator` now accepts an optional second argument `CustomParameterOptions` with an `arg` property. This lets you create custom decorators that also register a GraphQL argument in the schema:

```ts
import { createParameterDecorator } from "type-graphql";

function CurrentPage() {
  return createParameterDecorator(({ args }) => args.page, {
    arg: {
      name: "page",
      typeFunc: () => Int,
      options: { defaultValue: 1 },
    },
  });
}
```

## Removed deprecated options

### `isAbstract` decorator option

The `isAbstract` option on `@ObjectType`, `@InputType`, and `@InterfaceType` decorators has been removed. It was previously used to prevent types from being emitted in the schema when using glob path resolution. Since glob paths are no longer supported and only explicitly imported resolver classes are used, this option is no longer needed.

If your code uses `isAbstract`, simply remove it:

```ts
// Before (v1.x)
@ObjectType({ isAbstract: true })
class BaseEntity { ... }

// After (v2.0) - just remove isAbstract
@ObjectType()
class BaseEntity { ... }
```

### `commentDescriptions` option

The `commentDescriptions` option has been removed from `PrintSchemaOptions` (used in `emitSchemaFile`). GraphQL v16 no longer supports `#` comments for descriptions in SDL — only the standard `"""` block string descriptions are used.

## Nullability and default values

### Fixed nullability with `defaultValue`

In `v1.x`, fields with a `defaultValue` were always emitted as non-nullable in the schema, regardless of the `nullable` option. This has been fixed in `v2.0` — the `nullable` option is now respected even when `defaultValue` is provided.

The `ConflictingDefaultWithNullableError` error class has been removed since this combination is now valid.

### Input field `name` option disabled

The `@Field({ name: "..." })` option for renaming fields in the schema has been disabled for input types. This feature had broken behavior for inputs where the renamed field could not be properly mapped back from the GraphQL input to the class property.

## Schema validation in `buildSchemaSync`

In `v1.x`, `buildSchemaSync` did not validate the generated schema, which meant invalid schemas could be created without any errors. In `v2.0`, `buildSchemaSync` now runs the same validation as `buildSchema` (via GraphQL introspection query).

If your schema has issues, `buildSchemaSync` will now throw a `GeneratingSchemaError` at build time instead of silently producing an invalid schema that would fail at query time.

## TypeScript and build target

### Build target

The package is now compiled with a target of `ES2021` (previously `ES2018`).

### Node.js version

Node.js >= 20.11.1 is now required. Support for Node.js 16.x and 18.x has been dropped.

### `ClassType` constraint

The generic constraint on `ClassType` has been tightened from `ClassType<T = any>` to `ClassType<T extends object = object>`. If you use `ClassType` in your code with a non-object type parameter, you will need to adjust your types.

## ESM support

TypeGraphQL `v2.0` ships both CommonJS and ESM bundles. If your project uses ESM (`"type": "module"` in `package.json`), it should just work.

A new `type-graphql/shim` entry point is also available for browser or frontend usage scenarios where the `reflect-metadata` polyfill is not needed. Read more in the [ESM docs](./esm.md) and [browser usage recipe](./browser-usage.md).

## Peer dependencies

Make sure to update your peer dependencies to the required minimum versions:

```sh
npm install graphql@^16.12.0 graphql-scalars@^1.25.0 type-graphql
```

Note that `graphql` has been updated from `^15.x` to `^16.x`. GraphQL.js v16 has its own breaking changes — most notably, it drops support for `#` comment descriptions in SDL (which is why `commentDescriptions` was removed), and some error handling internals changed. If you're coming from `graphql@15`, review the [graphql-js v16 release notes](https://github.com/graphql/graphql-js/releases/tag/v16.0.0) as well.

| Dependency        | Required version | Notes                                      |
| ----------------- | ---------------- | ------------------------------------------ |
| `graphql`         | `^16.12.0`       | Updated from `^15.x`                       |
| `graphql-scalars` | `^1.25.0`        | New required peer dependency               |
| `class-validator` | `>=0.14.3`       | Optional — only needed if `validate: true` |
