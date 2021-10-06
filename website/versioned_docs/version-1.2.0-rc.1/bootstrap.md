---
title: Bootstrapping
id: version-1.2.0-rc.1-bootstrap
original_id: bootstrap
---

After creating our resolvers, type classes, and other business-related code, we need to make our app run. First we have to build the schema, then we can expose it with an HTTP server, WebSockets or even MQTT.

## Create Executable Schema

To create an executable schema from type and resolver definitions, we need to use the `buildSchema` function.
It takes a configuration object as a parameter and returns a promise of a `GraphQLSchema` object.

In the configuration object we must provide a `resolvers` property, which can be an array of resolver classes:

```typescript
import { FirstResolver, SecondResolver } from "../app/src/resolvers";
// ...
const schema = await buildSchema({
  resolvers: [FirstResolver, SecondResolver],
});
```

Be aware that only operations (queries, mutation, etc.) defined in the resolvers classes (and types directly connected to them) will be emitted in schema.

So if we have defined some object types (that implements an interface type [with disabled auto registering](interfaces.md#registering-in-schema)) but are not directly used in other types definition (like a part of an union, a type of a field or a return type of an operation), we need to provide them manually in `orphanedTypes` options of `buildSchema`:

```typescript
import { FirstResolver, SecondResolver } from "../app/src/resolvers";
import { FirstObject } from "../app/src/types";
// ...
const schema = await buildSchema({
  resolvers: [FirstResolver, SecondResolver],
  // here provide all the types that are missing in schema
  orphanedTypes: [FirstObject],
});
```

In case of defining the resolvers array somewhere else (not inline in the `buildSchema`), we need to use the `as const` syntax to inform the TS compiler and satisfy the `NonEmptyArray<T>` constraints:

```typescript
// resolvers.ts
export const resolvers = [FirstResolver, SecondResolver] as const;

// schema.ts
import { resolvers } from "./resolvers";

const schema = await buildSchema({ resolvers });
```

However, when there are several resolver classes, manual imports can be cumbersome.
So we can also provide an array of paths to resolver module files instead, which can include globs:

```typescript
const schema = await buildSchema({
  resolvers: [__dirname + "/modules/**/*.resolver.{ts,js}", __dirname + "/resolvers/**/*.{ts,js}"],
});
```

> Be aware that in case of providing paths to resolvers files, TypeGraphQL will emit all the operations and types that are imported in the resolvers files or their dependencies.

There are also other options related to advanced features like [authorization](authorization.md) or [validation](validation.md) - you can read about them in docs.

To make `await` work, we need to declare it as an async function. Example of `main.ts` file:

```typescript
import { buildSchema } from "type-graphql";

async function bootstrap() {
  const schema = await buildSchema({
    resolvers: [__dirname + "/**/*.resolver.{ts,js}"],
  });

  // other initialization code, like creating http server
}

bootstrap(); // actually run the async function
```

## Create an HTTP GraphQL endpoint

In most cases, the GraphQL app is served by an HTTP server. After building the schema we can create the GraphQL endpoint with a variety of tools such as [`graphql-yoga`](https://github.com/prisma/graphql-yoga) or [`apollo-server`](https://github.com/apollographql/apollo-server). Here is an example using [`apollo-server`](https://github.com/apollographql/apollo-server):

```typescript
import { ApolloServer } from "apollo-server";

const PORT = process.env.PORT || 4000;

async function bootstrap() {
  // ... Building schema here

  // Create the GraphQL server
  const server = new ApolloServer({
    schema,
    playground: true,
  });

  // Start the server
  const { url } = await server.listen(PORT);
  console.log(`Server is running, GraphQL Playground available at ${url}`);
}

bootstrap();
```

Remember to install the `apollo-server` package from npm - it's not bundled with TypeGraphQL.

Of course you can use the `express-graphql` middleware, `graphql-yoga` or whatever you want 😉

## Create typeDefs and resolvers map

TypeGraphQL provides a second way to generate the GraphQL schema - the `buildTypeDefsAndResolvers` function.

It accepts the same `BuildSchemaOptions` as the `buildSchema` function but instead of an executable `GraphQLSchema`, it creates a typeDefs and resolversMap pair that you can use e.g. with [`graphql-tools`](https://github.com/apollographql/graphql-tools):

```typescript
import { makeExecutableSchema } from "graphql-tools";

const { typeDefs, resolvers } = await buildTypeDefsAndResolvers({
  resolvers: [FirstResolver, SecondResolver],
});

const schema = makeExecutableSchema({ typeDefs, resolvers });
```

Or even with other libraries that expect the schema info in that shape, like [`apollo-link-state`](https://github.com/apollographql/apollo-link-state):

```typescript
import { withClientState } from "apollo-link-state";

const { typeDefs, resolvers } = await buildTypeDefsAndResolvers({
  resolvers: [FirstResolver, SecondResolver],
});

const stateLink = withClientState({
  // ...other options like `cache`
  typeDefs,
  resolvers,
});

// ...the rest of `ApolloClient` initialization code
```

There's also a sync version of it - `buildTypeDefsAndResolversSync`:

```typescript
const { typeDefs, resolvers } = buildTypeDefsAndResolvers({
  resolvers: [FirstResolver, SecondResolver],
});
```

However, be aware that some of the TypeGraphQL features (i.a. [query complexity](complexity.md)) might not work with the `buildTypeDefsAndResolvers` approach because they use some low-level `graphql-js` features.
