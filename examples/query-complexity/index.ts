import "reflect-metadata";
import { GraphQLServer, Options } from "graphql-yoga";
import { buildSchema } from "../../src";
import queryComplexity from "graphql-query-complexity";
import { RecipeResolver } from "./recipe-resolver";

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
    validationRules: req => [
      /**
       * This  provides GraphQL query analysis to reject complex queries to your GraphQL server.
       * This can be used to protect your GraphQL servers
       * against resource exhaustion and DoS attacks.
       * More doucmentation can be found (here)[https://github.com/ivome/graphql-query-complexity]
       */
      queryComplexity({
        maximumComplexity: 8,
        variables: req.query.variables,
        onComplete: (complexity: number) => {
          console.log("Query Complexity:", complexity);
        },
      }),
    ],
  };

  // Start the server
  server.start(serverOptions, ({ port, playground }) => {
    console.log(
      `Server is running, GraphQL Playground available at http://localhost:${port}${playground}`,
    );
  });
}

bootstrap();
