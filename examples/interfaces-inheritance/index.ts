import "reflect-metadata";
import * as path from "node:path";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { buildSchema } from "type-graphql";
import { Person } from "./person/person.type";
import { MultiResolver } from "./resolver";

async function bootstrap() {
  // build TypeGraphQL executable schema
  const schema = await buildSchema({
    resolvers: [MultiResolver],
    emitSchemaFile: path.resolve(__dirname, "schema.graphql"),
    // provide the type that implements an interface
    // but is not directly used in schema
    orphanedTypes: [Person],
  });

  // Create GraphQL server
  const server = new ApolloServer({ schema });
  // Start server
  const { url } = await startStandaloneServer(server, { listen: { port: 4000 } });
  console.log(`GraphQL server ready at ${url}`);
}

bootstrap().catch(console.error);
