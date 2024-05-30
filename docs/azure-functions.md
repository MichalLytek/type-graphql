---
title: Azure Functions Integration
---

## Using TypeGraphQL in Microsoft Azure Functions

Integrating TypeGraphQL with Azure Functions involves the following key steps:

1. Generate GraphQL schema based on your resolvers
2. Notify Apollo Server about your schema

Below is how you can implement the azure function entry point (with explanations in-line):

```ts
// index.ts

import "reflect-metadata";
import path from "path";
import { ApolloServer } from "@apollo/server";
import { startServerAndCreateHandler } from "@as-integrations/azure-functions";
import { buildSchemaSync } from "type-graphql";
import { Container } from "typedi";
import { GraphQLFormattedError } from "graphql";
import { UserResolver } from "YOUR_IMPORT_PATH"; // TypeGraphQL Resolver
import { AccountResolver } from "YOUR_IMPORT_PATH"; // TypeGraphQL Resolver

// Bundle resolvers to build the schema
const schema = buildSchemaSync({
  // Include resolvers you'd like to expose to the API
  // Deployment to Azure functions might fail if
  // you include too much resolvers (means your app is too big)
  resolvers: [
    UserResolver,
    AccountResolver,
    // your other resolvers
  ],

  // Only build the GraphQL schema locally
  // The resulting schema.graphql will be generated to the following path:
  // Path: /YOUR_PROJECT/src/schema.graphql
  emitSchemaFile: process.env.NODE_ENV === "local" ? path.resolve("./src/schema.graphql") : false,
  container: Container,
  validate: true,
});

// Add schema into Apollo Server
const server = new ApolloServer({
  // include your schema
  schema,

  // only allow introspection in non-prod environments
  introspection: process.env.NODE_ENV !== "production",

  // you can handle errors in your own styles
  formatError: (err: GraphQLFormattedError) => err,
});

// Start the server(less handler/function)
export default startServerAndCreateHandler(server);
```

Each Azure Function needs to have an equivalent configuration file called `function.json`, here's how you can configure it:

```json
// function.json

{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "route": "graphql",
      "methods": ["get", "post", "options"]
    },
    {
      "type": "http",
      "direction": "out",
      "name": "$return"
    }
  ],
  "scriptFile": "../dist/handler-graphql/index.js"
}
```

For better maintainability of your codebase, we recommend separate your Azure Functions into its own folders, away from the actual GraphQL Resolvers. Here's an example:

```text
/YOUR_PROJECT
  /handlers
    /handler-graphql
      index.ts
      function.json
    /handler-SOME-OTHER-FUNCTION-1
      index.ts
      function.json
    /handler-SOME-OTHER-FUNCTION-2
      index.ts
      function.json

  /src
    /resolvers
      user.resolver.ts
      account.resolver.ts
    /services
      user.service.ts
      account.service.ts

  package.json
  host.json
  .eslintrc.js
  .prettierrc
  .eslintignore
  .prettierignore

etc etc etc...
```
