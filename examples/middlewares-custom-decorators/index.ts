import "reflect-metadata";
import path from "node:path";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { buildSchema } from "type-graphql";
import Container from "typedi";
import type { Context } from "./context";
import { ErrorLoggerMiddleware } from "./middlewares/error-logger";
import { ResolveTimeMiddleware } from "./middlewares/resolve-time";
import { RecipeResolver } from "./recipe/recipe.resolver";

async function bootstrap() {
  // build TypeGraphQL executable schema
  const schema = await buildSchema({
    // Array of resolvers
    resolvers: [RecipeResolver],
    globalMiddlewares: [ErrorLoggerMiddleware, ResolveTimeMiddleware],
    container: Container,
    // Create 'schema.graphql' file with schema definition in current directory
    emitSchemaFile: path.resolve(__dirname, "schema.graphql"),
  });

  // Create GraphQL server
  const server = new ApolloServer({
    schema,
  });

  // Start server
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async (): Promise<Context> => ({
      // example user
      currentUser: {
        id: 123,
        name: "Sample user",
      },
    }),
  });
  console.log(`GraphQL server ready at ${url}`);
}

bootstrap().catch(console.error);
