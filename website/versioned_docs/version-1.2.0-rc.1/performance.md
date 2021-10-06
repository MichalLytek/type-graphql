---
title: Performance
id: version-1.2.0-rc.1-performance
original_id: performance
---

**TypeGraphQL** is basically an abstraction layer built on top of the reference GraphQL implementation for Javascript - [`graphql-js`](https://github.com/graphql/graphql-js). It not only allows for building a GraphQL schema using classes and decorators but also gives a set of tools that focus on the developer experience and allows for making common tasks easily - authorization, validation, custom middlewares and others.

While this enable easy and convenient development, it's sometimes a tradeoff in a performance.

## Benchmarks

To measure the overhead of the abstraction, a few demo examples were made to compare the usage of TypeGraphQL against the implementations using "bare metal" - raw `graphql-js` library. The benchmarks are located in a [folder on the GitHub repo](https://github.com/MichalLytek/type-graphql/tree/master/benchmarks).

The most demanding cases like returning an array of 25 000 nested objects showed that in some cases it might be about 5 times slower.

|                      | 25 000 array items | Deeply nested object |
| -------------------- | :----------------: | :------------------: |
| Standard TypeGraphQL |     1253.28 ms     |       45.57 μs       |
| `graphql-js`         |     265.52 ms      |       24.22 μs       |

In real apps (e.g. with complex database queries) it's usually a much lower factor but still not negligible. That's why TypeGraphQL has some built-in performance optimization options.

## Optimizations

Promises in JS have a quite big performance overhead. In the same example of returning an array with 25 000 items, if we change the Object Type field resolvers to an asynchronous one that return a promise, the execution slows down by a half even in "raw" `graphql-js`.

| `graphql-js`    | 25 000 array items |
| --------------- | :----------------: |
| sync resolvers  |     265.52 ms      |
| async resolvers |     512.61 ms      |

TypeGraphQL tries to avoid the async execution path when it's possible, e.g. if the query/mutation/field resolver doesn't use the auth feature, doesn't use args (or has args validation disabled) and if doesn't return a promise. So if you find a bottleneck in your app, try to investigate your resolvers, disable not used features and maybe remove some unnecessary async/await usage.

Also, using middlewares implicitly turns on the async execution path (for global middlewares the middlewares stack is created even for every implicit field resolver!), so be careful when using this feature if you care about the performance very much (and maybe then use the "simple resolvers" tweak described below).

The whole middleware stack will be soon redesigned with a performance in mind and with a new API that will also allow fine-grained scoping of global middlewares. Stay tuned!

## Further performance tweaks

When we have a query that returns a huge amount of JSON-like data and we don't need any field-level access control or other custom middlewares, we can turn off the whole authorization and middlewares stack for selected field resolver using a `{ simple: true }` decorator option, e.g.:

```typescript
@ObjectType()
class SampleObject {
  @Field()
  sampleField: string;

  @Field({ simple: true })
  publicFrequentlyQueriedField: SomeType;
}
```

Moreover, we can also apply this behavior for all the fields of the object type by using a `{ simpleResolvers: true }` decorator option, e.g.:

```typescript
@ObjectType({ simpleResolvers: true })
class Post {
  @Field()
  title: string;

  @Field()
  createdAt: Date;

  @Field()
  isPublished: boolean;
}
```

This simple trick can speed up the execution up to 76%! The benchmarks show that using simple resolvers allows for as fast execution as with bare `graphql-js` - the measured overhead is only about ~13%, which is a much more reasonable value than 500%. Below you can see [the benchmarks results](https://github.com/MichalLytek/type-graphql/tree/master/benchmarks):

|                                                                               | 25 000 array items |
| ----------------------------------------------------------------------------- | :----------------: |
| `graphql-js`                                                                  |     265.52 ms      |
| Standard TypeGraphQL                                                          |     310.36 ms      |
| TypeGraphQL with a global middleware                                          |     1253.28 ms     |
| **TypeGraphQL with "simpleResolvers" applied <br> (and a global middleware)** |   **299.61 ms**    |

> This optimization **is not turned on by default** mostly because of the global middlewares and authorization feature.

By using "simple resolvers" we are turning them off, so we have to be aware of the consequences - `@Authorized` guard on fields won't work for that fields so they will be publicly available, as well as global middlewares won't be executed for that fields, so we might lost, for example, performance metrics or access logs.

That's why we should **be really careful with using this tweak**. The rule of thumb is to use "simple resolvers" only when it's really needed, like returning huge array of nested objects.
