import "reflect-metadata";
import { GraphQLServer, Options } from "graphql-yoga";
import { buildSchema } from "../../src";

import { ExampleResolver } from "./resolver";
import { Context } from "./context.interface";
import { authChecker } from "./auth-checker";

void (async function bootstrap() {
  // build TypeGraphQL executable schema
  const schema = await buildSchema({
    resolvers: [ExampleResolver],
    authChecker, // register auth checking function
  });

  // Create GraphQL server
  const server = new GraphQLServer({
    schema,
    context: ({ request }) => {
      const ctx: Context = {
        // create mocked user in context
        // in real app you would be mapping user from `request.user` or sth
        user: {
          id: 1,
          name: "Sample user",
          roles: ["REGULAR"],
        },
      };
      return ctx;
    },
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
})();
