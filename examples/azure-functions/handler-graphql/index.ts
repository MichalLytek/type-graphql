/**
 * Very important to specify the line "import 'reflect-metadata';" for TypeGraphQL to compile.
 *
 * Since this is the entry point of our GraphQL endpoint, let's do it in this file once and for all
 */
import "reflect-metadata";
import path from "path";
import { ApolloServer } from "@apollo/server";
import { startServerAndCreateHandler } from "@as-integrations/azure-functions";
import { type GraphQLFormattedError } from "graphql";
import { buildSchemaSync } from "type-graphql";
import { Container } from "typedi";
import { UserResolver } from "../src/resolvers/user.resolver";

const schema = buildSchemaSync({
  resolvers: [UserResolver],

  // Only build the GraphQL schema locally
  // The resulting schema.graphql will be generated to the following path:
  // Path: /PROJECT_ROOT/src/schema.graphql
  emitSchemaFile: process.env.NODE_ENV === "local" ? path.resolve("./src/schema.graphql") : false,
  container: Container,
  validate: true,
});

const server = new ApolloServer({
  schema,
  introspection: true,
  formatError: (err: GraphQLFormattedError) => err,
});

// eslint-disable-next-line import/no-default-export
export default startServerAndCreateHandler(server);
