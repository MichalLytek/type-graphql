import "reflect-metadata";
import path from "node:path";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { container } from "tsyringe";
import { buildSchema } from "type-graphql";
import { sampleRecipes } from "./recipe.data";
import { RecipeResolver } from "./recipe.resolver";

// Add sample recipes in container
container.register("SAMPLE_RECIPES", { useValue: sampleRecipes.slice() });

async function bootstrap() {
  // Build TypeGraphQL executable schema
  const schema = await buildSchema({
    // Array of resolvers
    resolvers: [RecipeResolver],
    // Registry 3rd party IOC container
    container: { get: cls => container.resolve(cls) },
    // Create 'schema.graphql' file with schema definition in current directory
    emitSchemaFile: path.resolve(__dirname, "schema.graphql"),
  });

  // Create GraphQL server
  const server = new ApolloServer({ schema });

  // Start server
  const { url } = await startStandaloneServer(server, { listen: { port: 4000 } });
  console.log(`GraphQL server ready at ${url}`);
}

bootstrap().catch(console.error);
