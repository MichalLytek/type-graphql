import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import Container from "typedi";
import path from "path";
import { buildSchema } from "../../src";

import { RecipeResolver } from "./resolver";
import { Context } from "./context.interface";
import { LoggerMiddleware } from "./logger.middleware";

void (async function bootstrap() {
  // build TypeGraphQL executable schema
  const schema = await buildSchema({
    container: Container,
    resolvers: [RecipeResolver],
    globalMiddlewares: [LoggerMiddleware],
    emitSchemaFile: path.resolve(__dirname, "schema.gql"),
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
