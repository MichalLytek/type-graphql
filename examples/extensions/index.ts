import "reflect-metadata";
import path from "node:path";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { buildSchema } from "type-graphql";
import { Container } from "typedi";
import type { Context } from "./context.type";
import { LoggerMiddleware } from "./logger.middleware";
import { RecipeResolver } from "./resolver";

async function bootstrap() {
  // Build TypeGraphQL executable schema
  const schema = await buildSchema({
    // Array of resolvers
    resolvers: [RecipeResolver],
    // IOC container
    container: Container,
    // Global middleware
    globalMiddlewares: [LoggerMiddleware],
    // Create 'schema.graphql' file with schema definition in current directory
    emitSchemaFile: path.resolve(__dirname, "schema.graphql"),
  });

  // Create GraphQL server
  const server = new ApolloServer<Context>({
    schema,
  });

  // Start server
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    // Provide context
    context: async () => ({
      // Example user
      user: {
        id: 123,
        name: "Sample user",
      },
    }),
  });
  console.log(`GraphQL server ready at ${url}`);
}

bootstrap().catch(console.error);
