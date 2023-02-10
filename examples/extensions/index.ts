import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import Container from "typedi";
import { buildSchema } from "type-graphql";

import { ExampleResolver } from "./resolver";
import { Context } from "./context.interface";
import { LoggerMiddleware } from "./logger.middleware";

void (async function bootstrap() {
  // build TypeGraphQL executable schema
  const schema = await buildSchema({
    container: Container,
    resolvers: [ExampleResolver],
    globalMiddlewares: [LoggerMiddleware],
  });

  // Create GraphQL server
  const server = new ApolloServer({
    schema,
    context: () => {
      const ctx: Context = {
        // example user
        user: {
          id: 123,
          name: "Sample user",
        },
      };
      return ctx;
    },
  });

  // Start the server
  const { url } = await server.listen(4000);
  console.log(`Server is running, GraphQL Playground available at ${url}`);
})();
