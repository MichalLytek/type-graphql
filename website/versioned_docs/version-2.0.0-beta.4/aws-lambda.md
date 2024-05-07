---
title: AWS Lambda integration
id: version-2.0.0-beta.4-aws-lambda
original_id: aws-lambda
---

## Using TypeGraphQL in AWS Lambda environment

AWS Lambda environment is a bit different than a standard Node.js server deployment.

However, the only tricky part with the setup is that we need to "cache" the built schema, to save some computing time by avoiding rebuilding the schema on every request to our lambda.

So all we need to do is to assign the built schema to the local variable using the `??=` conditional assignment operator.
We can do the same thing for `ApolloServer`.

Below you you can find the full snippet for the AWS Lambda integration:

```ts
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { ApolloServer } from "apollo-server-lambda";

let cachedSchema: GraphQLSchema | null = null;
let cachedServer: ApolloServer | null = null;

export const handler: APIGatewayProxyHandlerV2 = async (event, context, callback) => {
  // build TypeGraphQL executable schema only once, then read it from local "cached" variable
  cachedSchema ??= await buildSchema({
    resolvers: [RecipeResolver],
  });

  // create the GraphQL server only once
  cachedServer ??= new ApolloServer({ schema: cachedSchema });

  // make a handler for `aws-lambda`
  return cachedServer.createHandler({})(event, context, callback);
};
```
