import "reflect-metadata";
import path from "node:path";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { fieldExtensionsEstimator, getComplexity, simpleEstimator } from "graphql-query-complexity";
import { buildSchema } from "type-graphql";
import { RecipeResolver } from "./recipe.resolver";

// Maximum allowed complexity
const MAX_COMPLEXITY = 20;

async function bootstrap() {
  // Build TypeGraphQL executable schema
  const schema = await buildSchema({
    // Array of resolvers
    resolvers: [RecipeResolver],
    // Create 'schema.graphql' file with schema definition in current directory
    emitSchemaFile: path.resolve(__dirname, "schema.graphql"),
  });

  // Create GraphQL server
  const server = new ApolloServer({
    schema,
    // Create a plugin to allow query complexity calculation for every request
    plugins: [
      {
        requestDidStart: async () => ({
          async didResolveOperation({ request, document }) {
            /**
             * Provides GraphQL query analysis to be able to react on complex queries to the GraphQL server
             * It can be used to protect the GraphQL server against resource exhaustion and DoS attacks
             * More documentation can be found at https://github.com/ivome/graphql-query-complexity
             */
            const complexity = getComplexity({
              // GraphQL schema
              schema,
              // To calculate query complexity properly,
              // check only the requested operation
              // not the whole document that may contains multiple operations
              operationName: request.operationName,
              // GraphQL query document
              query: document,
              // GraphQL query variables
              variables: request.variables,
              // Add any number of estimators. The estimators are invoked in order, the first
              // numeric value that is being returned by an estimator is used as the field complexity
              // If no estimator returns a value, an exception is raised
              estimators: [
                // Using fieldExtensionsEstimator is mandatory to make it work with type-graphql
                fieldExtensionsEstimator(),
                // Add more estimators here...
                // This will assign each field a complexity of 1
                // if no other estimator returned a value
                simpleEstimator({ defaultComplexity: 1 }),
              ],
            });

            // React to the calculated complexity,
            // like compare it with max and throw error when the threshold is reached
            if (complexity > MAX_COMPLEXITY) {
              throw new Error(
                `Sorry, too complicated query! ${complexity} exceeded the maximum allowed complexity of ${MAX_COMPLEXITY}`,
              );
            }
            console.log("Used query complexity points:", complexity);
          },
        }),
      },
    ],
  });

  // Start server
  const { url } = await startStandaloneServer(server, { listen: { port: 4000 } });
  console.log(`GraphQL server ready at ${url}`);
}

bootstrap();
