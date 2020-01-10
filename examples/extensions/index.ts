import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import { buildSchema } from "../../src";

import { ExampleResolver } from "./resolver";
import { Context } from "./context.interface";
import { AuthorizerMiddleware } from "./authorizer.middleware";
import { LoggerMiddleware } from "./logger.middleware";

void (async function bootstrap() {
  // build TypeGraphQL executable schema
  const schema = await buildSchema({
    resolvers: [ExampleResolver],
    globalMiddlewares: [AuthorizerMiddleware, LoggerMiddleware],
  });

  // Create GraphQL server
  const server = new ApolloServer({
    schema,
    context: () => {
      const ctx: Context = {
        // create mocked user in context
        // in real app you would be mapping user from `req.user` or sth
        user: {
          id: 1,
          name: "Sample user",
          roles: ["REGULAR"],
        },
      };
      return ctx;
    },
  });

  // Start the server
  const { url } = await server.listen(4000);
  console.log(`Server is running, GraphQL Playground available at ${url}`);
})();
