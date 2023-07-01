import "reflect-metadata";
import * as path from "node:path";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolver";

async function bootstrap() {
  // Build TypeGraphQL executable schema
  const schema = await buildSchema({
    // Array of resolvers
    resolvers: [UserResolver],
    // Create 'schema.graphql' file with schema definition in current directory
    emitSchemaFile: path.resolve(__dirname, "schema.graphql"),
    skipCheck: true,
    validate: true,
  });

  // Create GraphQL server
  const server = new ApolloServer({ schema });

  // Start server
  const { url } = await startStandaloneServer(server, { listen: { port: 4000 } });
  console.log(`GraphQL server ready at ${url}`);
}

bootstrap().catch(console.error);
