---
title: Announcing TypeGraphQL 1.0 🚀
author: Michał Lytek
authorURL: https://github.com/MichalLytek
authorImageURL: /img/author.jpg
---

It's finally happening! Over two years after the [initial announcement](http://localhost:3000/blog/2018/03/25/medium-article.html), [TypeGraphQL](https://typegraphql.com/) is now ready for its first stable release - `v1.0.0` 🎉

It was a really long journey that started in 31st of January 2018 with [releasing `v0.1.0`](https://www.npmjs.com/package/type-graphql/v/0.1.0) and which contained 650+ commits, 85+ merged PRs and [4.9k+ stars on GitHub](https://github.com/MichalLytek/type-graphql).

This post is focused mostly on presenting new features and describing changes in the newest stable release. Well, then, without further ado... let's take a look what the TypeGraphQL 1.0 brings us!

- [Performance](#performance)
- [Schema isolation](#isolation)
- [Directives and extensions](#directives-extensions)
- [Resolvers and arguments for interface fields](#interfaces)
- [More descriptive errors messages](#errors)
- [Transforming nested inputs and arrays](#transforming)
- [...and others 👀](#others)

<!--truncate-->

## Performance <a name="performance"></a>

One of the most important things which is also often neglected by developers - the performance. One of the key focus area for the 1.0 release was making it blazingly fast ⚡

TypeGraphQL is basically an abstraction layer built on top of the reference GraphQL implementation for JavaScript - `graphql-js`. To measure the overhead of the abstraction, a few demo examples were made to compare it against the "bare metal" - using raw `graphql-js` library.

It turned out that in the most demanding cases like returning an array of 25 000 nested objects, the old version `0.17` was even about 5 times slower!

| library             | execution time |
| ------------------- | :------------: |
| TypeGraphQL `v0.17` |   1253.28 ms   |
| `graphql-js`        |   265.52 ms    |

After profiling the code and finding all the root causes (like always using async execution path), the overhead was reduced from 500% to **just 17%** in `v1.0.0`! By using [`simpleResolvers`](https://typegraphql.com/docs/performance.html#further-performance-tweaks) it can be reduced even further, up to 13%:

|                          | execution time |
| ------------------------ | :------------: |
| `graphql-js`             |   265.52 ms    |
| **TypeGraphQL `v1.0`**   |   310.36 ms    |
| with "simpleResolvers"   |   299.61 ms    |
| with a global middleware |   1267.82 ms   |

Such small overhead is much easier to accept than the initial 500%!
More info about how to enable the performance optimizations in the more complex cases can be found [in the docs 📖](https://typegraphql.com/docs/performance.html).

## Schema isolation <a name="isolation"></a>

This is another feature that is not visible from the first sight but gives new possibilities like splitting the schema to public and private ones 👀

In 0.17.x and before, the schema was built from all the metadata collected by evaluating the TypeGraphQL decorators. The drawback of this approach was the schema leaks - every subsequent calls of `buildSchema` was returning the same schema which was combined from all the types and resolvers that could be find in the metadata storage.

In TypeGraphQL 1.0 it's no longer true!
The schemas are now isolated which means that the [`buildSchema` call takes the `resolvers` array from options](https://typegraphql.com/docs/bootstrap.html#create-executable-schema) and emit only the queries, mutation and types that are related to those resolvers.

```ts
const firstSchema = await buildSchema({
  resolvers: [FirstResolver],
});
const secondSchema = await buildSchema({
  resolvers: [SecondResolver],
});
```

So just by modifying the `resolvers` option we can have different sets of operations exposed in the GraphQL schemas!
Proper isolation also makes serverless development easier as it allows to get rid of the _"Schema must contain uniquely named types"_ errors and others.

## Directives and extensions <a name="directives-extensions"></a>

This two new features are two complementary ways to put some metadata about the schema items.

GraphQL directives though the syntax might remind the TS decorators, as "a directive is an identifier preceded by a @ character", but in fact, they are a purely Schema Definition Language feature. Apart from the metadata capabilities, they can also modify the schema and e.g. generate the connection type for pagination purposes. Basically, the looks like this:

```graphql
type Query {
  foobar: String! @auth(requires: USER)
}
```

To apply them, we just need to put the `@Directive` decorator above and supply the string argument, e.g.:

```ts
@Resolver()
class FooBarResolver {
  @Directive("@auth(requires: USER)")
  @Query()
  foobar(): string {
    return "foobar";
  }
}
```

However, on the other side we have the GraphQL extensions which are the JS way to achieve the same goal. It's the recommended way of putting the metadata about the types when applying some custom logic.

To declare the extensions for type or selected field, we need to use `@Extensions` decorator, e.g.:

```ts
@ObjectType()
class Foo {
  @Extensions({ roles: [Role.User] })
  @Field()
  bar: string;
}
```

We can then read that metadata in the resolvers or middlewares, just by exploring the `GraphQLResolveInfo` object, e.g.:

```ts
export const ExtensionsMiddleware: MiddlewareFn = async ({ info }, next) => {
  const { extensions } = info.parentType.getFields()[info.fieldName];
  console.log(extensions?.roles); // log the metadata
  return next();
};
```

More info about [directives](https://typegraphql.com/docs/directives.html) and [extensions](https://typegraphql.com/docs/extensions.html) features can be found in docs 📖

## Resolvers and arguments for interface fields <a name="interfaces"></a>

The last thing that was preventing TypeGraphQL from being fully GraphQL compliant thus blocking the 1.0 release - an ability to provide interface fields resolvers implementations and declare its arguments.

Basically, we can define resolvers for the interface fields using the same syntax we would use in case of the `@ObjectType`, e.g.:

```ts
@InterfaceType()
abstract class IPerson {
  @Field()
  avatar(@Arg("size") size: number): string {
    return `http://i.pravatar.cc/${size}`;
  }
}
```

...with only a few exceptions for cases like abstract methods and inheritance, which you can [read about in the docs](https://typegraphql.com/docs/interfaces.html#resolvers-and-arguments).

## More descriptive errors messages <a name="errors"></a>

One of the most irritating issues for newcomers were the laconic error messages that haven't provided enough info to easily find the mistakes in the code.

Messages like _"Cannot determine GraphQL input type for users"_ or even the a generic _"Generating schema error"_ were clearly not helpful enough while searching for the place where the flaws were located.

Now, when the error occurs, it is broadly explained, why it happened and what could we do to fix that, e.g.:

```text
Unable to infer GraphQL type from TypeScript reflection system.
  You need to provide explicit type for argument named 'filter'
  of 'getUsers' of 'UserResolver' class.
```

or:

```text
Some errors occurred while generating GraphQL schema:
  Interface field 'IUser.accountBalance' expects type 'String!'
  but 'Student.accountBalance' is of type 'Float'
```

That should allow developers to safe tons of time and really speed up the development 🏎

## Transforming nested inputs and arrays <a name="transforming"></a>

In the previous releases, an instance of the input type class was created only on the first level of inputs nesting.
So, in cases like this:

```ts
@InputType()
class SampleInput {
  @Field()
  sampleStringField: string;

  @Field()
  nestedField: SomeNestedInput;
}

@Resolver()
class SampleResolver {
  @Query()
  sampleQuery(@Arg("input") input: SampleInput): boolean {
    return input.nestedField instanceof SomeNestedInput;
  }
}
```

the `nestedField` property of `input` was just a plain `Object`, not an instance of the `SomeNestedInput` class. That behavior was producing some unwanted issues, including limited support for [inputs and args validation](https://typegraphql.com/docs/validation.html).

Since 1.0 release, it's no longer an issue and all the nested args and inputs are properly transformed to the corresponding input type classes instances, even including deeply nested arrays 💪

## One more thing... <a name="others"></a>

The 1.0 release is not our last word! We have plenty of feature requests from the community and [tons of our ideas to implement](https://github.com/MichalLytek/type-graphql/labels/Enhancement%20%3Anew%3A), so stay tuned and wait for more! 💪

Also, please keep in mind that TypeGraphQL is an MIT-licensed open source project. It doesn't have a large company that sits behind - its ongoing development is possible only thanks to the support by the community.

[![GitHub Sponsors](https://dev-to-uploads.s3.amazonaws.com/i/5hylzjhbjte7lq8ev7gf.png)](https://github.com/sponsors/TypeGraphQL)

[![Open Collective](https://opencollective.com/typegraphql/donate/button.png?color=blue)](https://opencollective.com/typegraphql)

If you fell in love with TypeGraphQL, please consider supporting our efforts and help it grow, especially if you are using it commercially - just to ensure that the project which your product relies on is actively maintained and improved.
