---
title: Bootstrapping
---

After creating our resolvers, type classes, and other business-related code, we need to make our app run. First we have to build the schema, then we can expose it with an HTTP server, WebSockets or even MQTT.

## Create Executable Schema

To create an executable schema from type and resolver definitions, we need to use the `buildSchema` function.
It takes a configuration object as a parameter and returns a promise of a `GraphQLSchema` object.

In the configuration object you must provide a `resolvers` property, which can be an array of resolver classes:

```typescript
import { FirstResolver, SecondResolver } from "../app/src/resolvers";
// ...
const schema = await buildSchema({
  resolvers: [FirstResolver, SampleResolver],
});
```

However, when there are several resolver classes, manual imports can be cumbersome.
So we can also provide an array of paths to resolver module files instead, which can include globs:

```typescript
const schema = await buildSchema({
  resolvers: [__dirname + "/modules/**/*.resolver.ts", __dirname + "/resolvers/**/*.ts"],
});
```

There are also other options related to advanced features like [authorization](authorization.md) or [validation](validation.md) - you can read about them in docs.

To make `await` work, we need to declare it as an async function. Example of `main.ts` file:

```typescript
import { buildSchema } from "type-graphql";

async function bootstrap() {
  const schema = await buildSchema({
    resolvers: [__dirname + "/**/*.resolver.ts"],
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

Be aware that some of the TypeGraphQL features (i.a. [query complexity](complexity.md)) might not work with the `buildTypeDefsAndResolvers` approach because they use some low-level `graphql-js` features.
