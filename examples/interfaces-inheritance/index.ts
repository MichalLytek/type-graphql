import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import * as path from "path";
import { buildSchema } from "type-graphql";

import { MultiResolver } from "./resolver";
import { Person } from "./person/person.type";

async function bootstrap() {
  // build TypeGraphQL executable schema
  const schema = await buildSchema({
    resolvers: [MultiResolver],
    emitSchemaFile: path.resolve(__dirname, "schema.gql"),
    // provide the type that implements an interface
    // but is not directly used in schema
    orphanedTypes: [Person],
  });

  // Create GraphQL server
  const server = new ApolloServer({ schema });

  // Start the server
  const { url } = await server.listen(4000);
  console.log(`Server is running, GraphQL Playground available at ${url}`);
}

bootstrap();
