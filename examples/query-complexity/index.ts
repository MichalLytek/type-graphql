import "reflect-metadata";
import queryComplexity, { simpleEstimator, fieldConfigEstimator } from "graphql-query-complexity";
import * as express from "express";
import * as graphqlHTTP from "express-graphql";
import expressPlayground from "graphql-playground-middleware-express";
import { buildSchema } from "../../src";

import { RecipeResolver } from "./recipe-resolver";

async function bootstrap() {
  // Build TypeGraphQL executable schema
  const schema = await buildSchema({
    resolvers: [RecipeResolver],
  });

  // in this example we're gonna use `express-graphql`
  // because `apollo-server` doesn't support passing variables to `validationRules`
  const app = express();
  app.use(
    "/graphql",
    graphqlHTTP(async (req, res, params) => ({
      schema,
      validationRules: [
        /**
         * This provides GraphQL query analysis to reject complex queries to your GraphQL server.
         * This can be used to protect your GraphQL servers
         * against resource exhaustion and DoS attacks.
         * More documentation can be found (here)[https://github.com/ivome/graphql-query-complexity]
         */
        queryComplexity({
          // The maximum allowed query complexity, queries above this threshold will be rejected
          maximumComplexity: 20,
          // The query variables. This is needed because the variables are not available
          // in the visitor of the graphql-js library
          variables: params!.variables!,
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
        }),
      ],
    })),
  );
  app.get("/playground", expressPlayground({ endpoint: "/graphql" }));
  app.listen(4000, () => {
    console.log(
      `Server is running, GraphQL Playground available at http://localhost:4000/playground`,
    );
  });
}

bootstrap();
