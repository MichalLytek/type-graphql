---
title: Query complexity
id: version-0.17.1-complexity
original_id: complexity
---

A single GraphQL query can potentially generate a huge workload for a server, like thousands of database operations which can be used to cause DDoS attacks. In order to limit and keep track of what each GraphQL operation can do, `TypeGraphQL` provides the option of integrating with Query Complexity tools like [graphql-query-complexity](https://github.com/ivome/graphql-query-complexity).

This cost analysis-based solution is very promising, since we can define a “cost” per field and then analyze the AST to estimate the total cost of the GraphQL query. Of course all the analysis is handled by `graphql-query-complexity`.

All we must do is define our complexity cost for the fields, mutations or subscriptions in `TypeGraphQL` and implement `graphql-query-complexity` in whatever GraphQL server that is being used.

## How to use

First, we need to pass `complexity` as an option to the decorator on a field, query or mutation.

Example of complexity

```typescript
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

In the next step, we will integrate `graphql-query-complexity` with the GraphQL server.

```typescript
// Create GraphQL server
const server = new GraphQLServer({ schema });

// Configure server options
const serverOptions: Options = {
  port: 4000,
  endpoint: "/graphql",
  playground: "/playground",
  validationRules: req => [
    queryComplexity({
      // The maximum allowed query complexity, queries above this threshold will be rejected
      maximumComplexity: 8,
      // The query variables. This is needed because the variables are not available
      // in the visitor of the graphql-js library
      variables: req.query.variables,
      // Optional callback function to retrieve the determined query complexity
      // Will be invoked whether the query is rejected or not
      // This can be used for logging or to implement rate limiting
      onComplete: (complexity: number) => {
        console.log("Query Complexity:", complexity);
      },
      estimators: [
        // Using fieldConfigEstimator is mandatory to make it work with type-graphql
        fieldConfigEstimator(),
        // This will assign each field a complexity of 1 if no other estimator
        // returned a value. We can define the default value for fields not explicitly annotated
        simpleEstimator({
          defaultComplexity: 1,
        }),
      ],
    }),
  ],
};

// Start the server
server.start(serverOptions, ({ port, playground }) => {
  console.log(
    `Server is running, GraphQL Playground available at http://localhost:${port}${playground}`,
  );
});
```

And it's done! 😉

For more info about how query complexity is computed, please visit [graphql-query-complexity](https://github.com/ivome/graphql-query-complexity).

## Example

See how this works in the [simple query complexity example](https://github.com/MichalLytek/type-graphql/tree/master/examples/query-complexity).
