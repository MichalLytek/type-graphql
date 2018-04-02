# Bootstrapping
After creating our resolvers and types classes with other business-related code, we need to make our app running. At first we have to build the schema, then we can expose it by HTTP server, WebSockets or even MQTT.

## Create executable schema
To create executable schema from types' and resolvers' definitions, you need to use `buildSchema` function.
It takes configuration object as a parameter and returns a promise of `GraphQLSchema` object.

In configuration object you need to provide `resolvers` property, which might be an array of resolver classes:
```ts
import { FirstResolver, SecondResolver } from "../app/src/resolvers";
// ...
const schema = await buildSchema({
  resolvers: [FirstResolver, SampleResolver],
});
``` 

However, when there're several dozen of resolver classes, manual imports might be a tedious work.
So you can also provide an array of path to resolver module files (they might be a glob):
```ts
const schema = await buildSchema({
  resolvers: [
    __dirname + "/modules/**/*.resolver.ts",
    __dirname + "/resolvers/**/*.ts",
  ],
});
```

There are also other options related to advanced features like [authorization](./authorization.md) or [validation](./validation.md) - you can read about them [in docs](../docs).

To make `await` work, we need to wrap it in async function. Example of `main.ts` file:
```ts
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
In most cases, the GraphQL app is served by a HTTP server. After building the schema we can create an express-based endpoint, using e.g. `express-graphql` package.

```ts
import * as express from "express";
import * as graphqlHTTP from "express-graphql";

async function bootstrap() {
  // bulding schema here...

  const app = express();
  app.use("/graphql", graphqlHTTP({
    schema,
    graphiql: true,
  }));
  app.listen(4000, () => {
    console.log("Running a GraphQL API server at localhost:4000/graphql");
  });
}

bootstrap();
```

Remember to install `express` and `express-graphql` packages from npm - there are not bundled with TypeGraphQL.
Of course you can use `apollo-server` or anything you want :wink:
