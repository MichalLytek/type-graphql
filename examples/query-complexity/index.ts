import "reflect-metadata";
import { GraphQLServer, Options } from "graphql-yoga";
import { buildSchema } from "../../src";
import queryComplexity, { simpleEstimator, fieldConfigEstimator } from "graphql-query-complexity";
import { RecipeResolver } from "./recipe-resolver";
import { ValidationContext } from "graphql";

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
       * More documentation can be found (here)[https://github.com/ivome/graphql-query-complexity]
       */
      queryComplexity({
        // The maximum allowed query complexity, queries above this threshold will be rejected
        maximumComplexity: 8,
        // The query variables. This is needed because the variables are not available
        // in the visitor of the graphql-js library
        variables: req.query.variables,
        // Optional callback function to retrieve the determined query complexity
        // Will be invoked weather the query is rejected or not
        // This can be used for logging or to implement rate limiting
        onComplete: (complexity: number) => {
          console.log("Query Complexity:", complexity);
        },
        // Add any number of estimators. The estimators are invoked in order, the first
        // numeric value that is being returned by an estimator is used as the field complexity.
        // If no estimator returns a value, an exception is raised.
        estimators: [
          fieldConfigEstimator(),
          // Add more estimators here...
          // This will assign each field a complexity of 1 if no other estimator
          // returned a value.
          simpleEstimator({
            defaultComplexity: 1,
          }),
        ],
      }) as ((context: ValidationContext) => any),
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
