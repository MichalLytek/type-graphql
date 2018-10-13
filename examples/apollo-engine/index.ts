import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import * as express from "express";
import { ApolloEngine } from "apollo-engine";
import { buildSchema } from "../../src";

import { RecipeResolver } from "./recipe-resolver";

async function bootstrap() {
  // build TypeGraphQL executable schema
  const schema = await buildSchema({
    resolvers: [RecipeResolver],
  });

  // create an express app
  const expressApp = express();
  // create apollo server
  const server = new ApolloServer({
    schema,
    tracing: true,
    cacheControl: true,
    engine: false, // we will provide our own ApolloEngine
  });
  // apply apollo server to the express app
  server.applyMiddleware({ app: expressApp });

  // configure shared config settings
  const port = 4000;
  const graphqlEndpointPath = "/graphql";

  // create an Apollo Engine
  const engine = new ApolloEngine({
    // set `APOLLO_ENGINE_API_KEY` env variable or put here your own API key
    apiKey: process.env.APOLLO_ENGINE_API_KEY,
  });

  // launch the Apollo Engine
  engine.listen(
    {
      port,
      expressApp,
      graphqlPaths: [graphqlEndpointPath],
    },
    () => console.log(`Server with Apollo Engine is running on http://localhost:${port}`),
  );
}

bootstrap();
