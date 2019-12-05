---
title: Performance
---

**TypeGraphQL** is basically an abstraction layer built on top of the reference GraphQL implementation for Javascript - [`graphql-js`](https://github.com/graphql/graphql-js). It not only allows for building a GraphQL schema using classes and decorators but also gives a set of tools that focus on the developer experience and allows for making common tasks easily - authorization, validation, custom middlewares and others.

While this enable easy and convenient development, it's sometimes a tradeoff in a performance.

## Benchmarks

To measure the overhead of the abstraction, a few demo examples were made to compare the usage of TypeGraphQL against the implementations using "bare metal" - raw `graphql-js` library. The benchmarks are located in a [folder on the GitHub repo](https://github.com/MichalLytek/type-graphql/tree/master/benchmarks).

The most demanding cases like returning an array of 10 000 nested objects shows that it's about 4 times slower. In real apps (e.g. with complex database queries) it's usually a much lower factor but still not negligible. That's why TypeGraphQL has some built-in performance optimization options.

## Optimizations

When we have a query that returns a huge amount of JSON-like data and we don't need any field-level access control, we can turn off the whole authorization and middlewares stack for selected field resolvers using a `{ simple: true }` decorator option, e.g.:

```typescript
@ObjectType()
class SampleObject {
  @Field()
  sampleField: string;

  @Field(type => [SuperComplexObject], { simple: true })
  superComplexData: SuperComplexObject[];
}
```

This simple trick can speed up the execution up to 72%! The benchmarks show that using simple resolvers allows for as fast execution as with bare `graphql-js` - the measured overhead is only about ~20%, which is a much more reasonable value than 400%. Below you can see [the benchmarks results](https://github.com/MichalLytek/type-graphql/tree/master/benchmarks):

|                                    | 10 000 array items | Deeply nested object |
| ---------------------------------- | :----------------: | :------------------: |
| Standard TypeGraphQL               |      42.551s       |        4.557s        |
| `graphql-js`                       |       9.963s       |        2.422s        |
| TypeGraphQL with "simpleResolvers" |      11.841s       |        3.086s        |

Moreover, you can also apply this behavior for all the fields of the object type by using a `{ simpleResolvers: true }` decorator option, e.g.:

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

### Caution

This optimization **is not turned on by default** mostly because of the global middlewares and authorization feature. By using "simple resolvers" we are turning them off, so we have to be aware of the consequences - `@Authorized` guard on fields won't work for that fields so they will be publicly available, as well as global middlewares won't be executed for that fields, so we might lost, for example, performance metrics or access logs.

That's why we should **be really careful with using this feature**. The rule of thumb is to use "simple resolvers" only when it's really needed, like returning huge array of nested objects.
