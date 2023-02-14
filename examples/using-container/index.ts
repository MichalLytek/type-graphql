import "reflect-metadata";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { Container } from "typedi";
import { buildSchema } from "type-graphql";
import { RecipeResolver } from "./recipe.resolver";
import { sampleRecipes } from "./recipe.data";

// Add sample recipes in container
Container.set({ id: "SAMPLE_RECIPES", factory: () => sampleRecipes.slice() });

async function bootstrap() {
  // Build TypeGraphQL executable schema
  const schema = await buildSchema({
    resolvers: [RecipeResolver],
    // Registry 3rd party IOC container
    container: Container,
  });

  // Create GraphQL server
  const server = new ApolloServer({ schema });

  // Start server
  const { url } = await startStandaloneServer(server, { listen: { port: 4000 } });
  console.log(`GraphQL server ready at ${url}`);
}

bootstrap();
