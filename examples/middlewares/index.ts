import "reflect-metadata";
import Container from "typedi";
import { GraphQLServer, Options } from "graphql-yoga";
import { useContainer, buildSchema, formatArgumentValidationError } from "../../src";

import { RecipeResolver } from "./recipe/recipe.resolver";
import { ResolveTimeMiddleware } from "./middlewares/resolve-time";
import { ErrorLoggerMiddleware } from "./middlewares/error-logger";

async function bootstrap() {
  useContainer(Container);

  // build TypeGraphQL executable schema
  const schema = await buildSchema({
    resolvers: [RecipeResolver],
    globalMiddlewares: [ErrorLoggerMiddleware, ResolveTimeMiddleware],
  });

  // Create GraphQL server
  const server = new GraphQLServer({ schema });

  // Configure server options
  const serverOptions: Options = {
    port: 4000,
    endpoint: "/graphql",
    playground: "/playground",
    formatError: formatArgumentValidationError,
  };

  // Start the server
  server.start(serverOptions, ({ port, playground }) => {
    console.log(
      `Server is running, GraphQL Playground available at http://localhost:${port}${playground}`,
    );
  });
}

bootstrap();
