import "reflect-metadata";
import path from "node:path";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { buildSchema } from "type-graphql";
import { authChecker } from "./auth-checker";
import { type Context } from "./context.type";
import { RecipeResolver } from "./recipe.resolver";

async function bootstrap() {
  // Build TypeGraphQL executable schema
  const schema = await buildSchema({
    // Array of resolvers
    resolvers: [RecipeResolver],
    // Register auth checker function
    authChecker,
    // Create 'schema.graphql' file with schema definition in current directory
    emitSchemaFile: path.resolve(__dirname, "schema.graphql"),
  });

  // Create GraphQL server
  const server = new ApolloServer<Context>({ schema });

  // Start server
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    // Provide context for each request
    context: async () => ({
      // Create mocked user in context
      // In real app you would be mapping user from 'req.user' or sth
      user: {
        id: 1,
        name: "Sample user",
        roles: ["REGULAR"],
      },
    }),
  });
  console.log(`GraphQL server ready at ${url}`);
}

bootstrap().catch(console.error);
