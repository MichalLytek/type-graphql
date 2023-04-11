import "reflect-metadata";
import path from "node:path";
import url from "node:url";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { buildSchema } from "type-graphql";
import { RecipeResolver } from "./recipe.resolver.js";

// Build TypeGraphQL executable schema
const schema = await buildSchema({
  // Array of resolvers
  resolvers: [RecipeResolver],
  // Create 'schema.graphql' file with schema definition in current directory
  emitSchemaFile: path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), "schema.graphql"),
});

// Create GraphQL server
const server = new ApolloServer({ schema });

// Start server
const { url: serverURL } = await startStandaloneServer(server, { listen: { port: 4000 } });
console.log(`GraphQL server ready at ${serverURL}`);
