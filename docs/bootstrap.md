---
title: Bootstrapping
---

After creating our resolvers and types classes with other business-related code, we need to make our app running. At first we have to build the schema, then we can expose it by HTTP server, WebSockets or even MQTT.

## Create executable schema

To create executable schema from types' and resolvers' definitions, you need to use `buildSchema` function.
It takes configuration object as a parameter and returns a promise of `GraphQLSchema` object.

In configuration object you need to provide `resolvers` property, which might be an array of resolver classes:

```typescript
import { FirstResolver, SecondResolver } from "../app/src/resolvers";
// ...
const schema = await buildSchema({
  resolvers: [FirstResolver, SampleResolver],
});
```

However, when there're several dozen of resolver classes, manual imports might be a tedious work.
So you can also provide an array of path to resolver module files (they might be a glob):

```typescript
const schema = await buildSchema({
  resolvers: [
    __dirname + "/modules/**/*.resolver.ts",
    __dirname + "/resolvers/**/*.ts",
  ],
});
```

There are also other options related to advanced features like [authorization](./authorization.md) or [validation](./validation.md) - you can read about them in docs.

To make `await` work, we need to wrap it in async function. Example of `main.ts` file:

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

In most cases, the GraphQL app is served by a HTTP server. After building the schema we can create it using e.g. [`graphql-yoga`](https://github.com/graphcool/graphql-yoga) package:

```typescript
import { GraphQLServer, Options } from "graphql-yoga";

const PORT = process.env.PORT || 4000;
async function bootstrap() {
  // Building schema here...

  // Create GraphQL server
  const server = new GraphQLServer({ schema });

  // Configure server options
  const serverOptions: Options = {
    port: 4000,
    endpoint: "/graphql",
    playground: "/playground",
  };

  // Start the server
  server.start(serverOptions, ({ port, playground }) => {
    console.log(
      `Server is running, GraphQL Playground available at http://localhost:${port}${playground}`,
    );
  });
}

bootstrap();
```

Remember to install `graphql-yoga` package from npm - there are not bundled with TypeGraphQL.

Of course you can use `express-graphql` middleware, `apollo-server` or anything you want 😉
