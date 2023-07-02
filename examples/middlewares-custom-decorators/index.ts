import "reflect-metadata";
import path from "node:path";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { buildSchema } from "type-graphql";
import Container from "typedi";
import type { Context } from "./context.type";
import { ErrorLoggerMiddleware, ResolveTimeMiddleware } from "./middlewares";
import { RecipeResolver } from "./recipe";

async function bootstrap() {
  // Build TypeGraphQL executable schema
  const schema = await buildSchema({
    // Array of resolvers
    resolvers: [RecipeResolver],
    // Array of global middlewares
    globalMiddlewares: [ErrorLoggerMiddleware, ResolveTimeMiddleware],
    // Create 'schema.graphql' file with schema definition in current directory
    emitSchemaFile: path.resolve(__dirname, "schema.graphql"),
    // Registry 3rd party IOC container
    container: Container,
  });

  // Create GraphQL server
  const server = new ApolloServer<Context>({ schema });

  // Start server
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    // Provide context for each request
    context: async (): Promise<Context> => ({
      // Create mocked user in context
      currentUser: {
        id: 123,
        name: "Sample user",
      },
    }),
  });
  console.log(`GraphQL server ready at ${url}`);
}

bootstrap().catch(console.error);
