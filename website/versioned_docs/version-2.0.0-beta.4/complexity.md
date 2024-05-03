---
title: Query complexity
id: version-2.0.0-beta.4-complexity
original_id: complexity
---

A single GraphQL query can potentially generate a huge workload for a server, like thousands of database operations which can be used to cause DDoS attacks. In order to limit and keep track of what each GraphQL operation can do, `TypeGraphQL` provides the option of integrating with Query Complexity tools like [graphql-query-complexity](https://github.com/ivome/graphql-query-complexity).

This cost analysis-based solution is very promising, since we can define a “cost” per field and then analyze the AST to estimate the total cost of the GraphQL query. Of course all the analysis is handled by `graphql-query-complexity`.

All we must do is define our complexity cost for the fields, mutations or subscriptions in `TypeGraphQL` and implement `graphql-query-complexity` in whatever GraphQL server that is being used.

## How to use

First, we need to pass `complexity` as an option to the decorator on a field, query or mutation.

Example of complexity

```ts
@ObjectType()
class MyObject {
  @Field({ complexity: 2 })
  publicField: string;

  @Field({ complexity: ({ args, childComplexity }) => childComplexity + 1 })
  complexField: string;
}
```

The `complexity` option may be omitted if the complexity value is 1.
Complexity can be passed as an option to any `@Field`, `@FieldResolver`, `@Mutation` or `@Subscription` decorator. If both `@FieldResolver` and `@Field` decorators of the same property have complexity defined, then the complexity passed to the field resolver decorator takes precedence.

In the next step, we will integrate `graphql-query-complexity` with the server that expose our GraphQL schema over HTTP.
You can use it with `express-graphql` like [in the lib examples](https://github.com/slicknode/graphql-query-complexity/blob/b6a000c0984f7391f3b4e886e3df6a7ed1093b07/README.md#usage-with-express-graphql), however we will use Apollo Server like in our other examples:

```ts
async function bootstrap() {
  // ... Build GraphQL schema

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
```

And it's done! 😉

For more info about how query complexity is computed, please visit [graphql-query-complexity](https://github.com/ivome/graphql-query-complexity).

## Example

See how this works in the [simple query complexity example](https://github.com/MichalLytek/type-graphql/tree/v2.0.0-beta.4/examples/query-complexity).
