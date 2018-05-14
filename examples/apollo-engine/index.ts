import "reflect-metadata";
import { Options, GraphQLServer } from "graphql-yoga";
import { ApolloEngine } from "apollo-engine";
import { buildSchema } from "../../src";

import { RecipeResolver } from "./recipe-resolver";

async function bootstrap() {
  // build TypeGraphQL executable schema
  const schema = await buildSchema({
    resolvers: [RecipeResolver],
  });

  // create GraphQL server
  const server = new GraphQLServer({ schema });

  // configure shared config settings
  const port = 4000;
  const graphqlEndpointPath = "/graphql";

  // configure server options
  const serverOptions: Options = {
    port,
    endpoint: graphqlEndpointPath,
    playground: "/playground",
    tracing: true,
    cacheControl: true,
  };

  // create an Apollo Engine
  const engine = new ApolloEngine({
    // set `APOLLO_ENGINE_API_KEY` env variable or put here your own API key
    apiKey: process.env.APOLLO_ENGINE_API_KEY,
  });

  // create GraphQL http server
  const httpServer = server.createHttpServer(serverOptions);

  // launch the Apollo Engine
  engine.listen(
    {
      port,
      httpServer,
      graphqlPaths: [graphqlEndpointPath],
    },
    () => console.log(`Server with Apollo Engine is running on http://localhost:${port}`),
  );
}

bootstrap();
