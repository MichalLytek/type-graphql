import "reflect-metadata";
import { GraphQLServer, Options } from "graphql-yoga";
import { Container } from "typedi";
import { useContainer, buildSchema } from "../../src";

import { RecipeResolver } from "./recipe-resolver";
import { sampleRecipes } from "./sample-recipes";

// register 3rd party IOC container
useContainer(Container);

// put sample recipes in container
Container.set({ id: "SAMPLE_RECIPES", factory: () => sampleRecipes.slice() });

async function bootstrap() {
  // build TypeGraphQL executable schema
  const schema = await buildSchema({
    resolvers: [RecipeResolver],
  });

  // Create GraphQL server
  const server = new GraphQLServer({ schema });

  // Configure server options
  const serverOptions: Options = {
    port: 4000,
    endpoint: "/graphql",
    playground: "/playground",
  };

  // Start the server
  server.start(serverOptions, ({ port, playground }) => {
    console.log(
      `Server is running, GraphQL Playground available at http://localhost:${port}${playground}`,
    );
  });
}

bootstrap();
