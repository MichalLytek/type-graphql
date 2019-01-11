---
title: Bootstrapping
id: version-0.16.0-bootstrap
original_id: bootstrap
---

After creating our resolvers, types classes, and other business-related code, we need to make our app run. First we have to build the schema, then we can expose it by HTTP server, WebSockets or even MQTT.

## Create Executable Schema

To create an executable schema from type and resolver definitions, you need to use the `buildSchema` function.
It takes a configuration object as a parameter and returns a promise of a `GraphQLSchema` object.

In the configuration object you must provide a `resolvers` property, which can be an array of resolver classes:

```typescript
import { FirstResolver, SecondResolver } from "../app/src/resolvers";
// ...
const schema = await buildSchema({
  resolvers: [FirstResolver, SampleResolver],
});
```

However, when there are several dozen of resolver classes, manual imports can be tedious.
So you can also provide an array of paths to resolver module files instead, which can include globs:

```typescript
const schema = await buildSchema({
  resolvers: [
    __dirname + "/modules/**/*.resolver.ts",
    __dirname + "/resolvers/**/*.ts",
  ],
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

## Create HTTP GraphQL endpoint

In most cases, the GraphQL app is served by a HTTP server. After building the schema we can create the GraphQL endpoint with a variety of tools such as [`graphql-yoga`](https://github.com/prisma/graphql-yoga) or [`apollo-server`](https://github.com/apollographql/apollo-server).  Here is an example using [`apollo-server`](https://github.com/apollographql/apollo-server):

```typescript
import { ApolloServer } from "apollo-server";

const PORT = process.env.PORT || 4000;

async function bootstrap() {
  // ... Building schema here

  // Create GraphQL server
  const server = new ApolloServer({ 
    schema,
    playground: true,
  });

  // Start the server
  const { url } = await server.listen(4000);
  console.log(`Server is running, GraphQL Playground available at ${url}`);
}

bootstrap();
```

Remember to install `apollo-server` package from npm - it's not bundled with TypeGraphQL.

Of course you can use `express-graphql` middleware, `graphql-yoga` or whatever you want 😉
