---
title: Query Complexity
---
A single GraphQL query can potentially generate thousands of database operations. To keep track and limit of what each graphQl operation can do , `TypeGraphQL` provides you the option of integrating with Query Complexity tools like  [graphql-query-complexity](https://github.com/ivome/graphql-query-complexity).


The cost analysis-based solution is very promising, since you can define a “cost” per field and then analyze the AST to estimate the total cost of the GraphQL query. Of course all the analysis is handled by `graphql-query-complexity` .

All you need to do is define your complexity cost for the fields (fields, mutattions, subscriptions) in`TypeGraphQL` and implement `graphql-query-complexity` in whatever graphQl server you have.

## How to use?
At first, you need to pass `complexity` as an option to the decorator on a field/query/mutation.

Example of complexity
```typescript

@ObjectType()
class MyObject {
  @Field({ complexity: 2})
  publicField: string;

  @Field({ complexity: 3 })
  complexField: string;
}
```

You can omit the `complexity` option if the complexity value is 1.

In next step, you need to integrate `graphql-query-complexity` with your graphql server. 

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
        // Will be invoked weather the query is rejected or not
        // This can be used for logging or to implement rate limiting
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
```

And it's done! 😉 . You can pass complexity as option to any of `@field`, `@fieldResolver`, `@mutation` & `@subscription`. For the same property, if both the @fieldresolver as well as @field have complexity defined , then the complexity passed to the field resolver decorator takes precedence. 

Have a look at the [graphql-query-complexity](https://github.com/ivome/graphql-query-complexity) docs to understand more about how query complexity is computed.


## Example
You can see how this works together in the [simple query complexity example](https://github.com/19majkel94/type-graphql/tree/master/examples/query-complexity).
