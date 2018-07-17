import "reflect-metadata";
import { GraphQLServer, Options } from "graphql-yoga";
import { useContainer, buildSchema } from "../../src";

import { RecipeResolver } from "./recipe/recipe.resolver";
import { ScopedContainer } from "./container";
import { Context } from "./types";

// register or custom, scoped IOC container
useContainer(ScopedContainer);

async function bootstrap() {
  // build TypeGraphQL executable schema
  const schema = await buildSchema({
    resolvers: [RecipeResolver],
  });

  // Create GraphQL server
  const server = new GraphQLServer({
    schema,
    // we need to provide unique context with `requestId` for each request
    context: (): Context => ({
      requestId: Math.floor(Math.random() * 1000000), // uuid-like
    }),
  });

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
