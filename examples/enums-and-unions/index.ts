import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import path from "path";
import { buildSchema } from "../../src";

import { ExampleResolver } from "./resolver";

async function bootstrap() {
  // build TypeGraphQL executable schema
  const schema = await buildSchema({
    resolvers: [ExampleResolver],
    emitSchemaFile: path.resolve(__dirname, "schema.gql"),
  });

  // Create GraphQL server
  const server = new ApolloServer({ schema });

  // Start the server
  const { url } = await server.listen(4000);
  console.log(`Server is running, GraphQL Playground available at ${url}`);
}

bootstrap();
