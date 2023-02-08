import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import { buildSchema } from "../../src";

import { SampleResolver } from "./resolver";

async function bootstrap() {
  // Build the TypeGraphQL schema
  const schema = await buildSchema({
    resolvers: [SampleResolver],
  });

  // Create GraphQL server
  const server = new ApolloServer({ schema });

  // Start the server
  const { url } = await server.listen(4000);
  console.log(`Server is running, GraphQL Playground available at ${url}`);
}

bootstrap();
