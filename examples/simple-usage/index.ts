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
      queryComplexity({
        maximumComplexity: 1000,
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
