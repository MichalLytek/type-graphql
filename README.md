![logo](https://raw.githubusercontent.com/MichalLytek/type-graphql/master/img/logo.png)

# TypeGraphQL

[![npm version](https://badge.fury.io/js/type-graphql.svg)](https://badge.fury.io/js/type-graphql)
[![Build Status](https://travis-ci.com/MichalLytek/type-graphql.svg?branch=master)](https://travis-ci.com/MichalLytek/type-graphql)
[![codecov](https://codecov.io/gh/MichalLytek/type-graphql/branch/master/graph/badge.svg)](https://codecov.io/gh/MichalLytek/type-graphql)
[![dependencies](https://david-dm.org/MichalLytek/type-graphql/status.svg)](https://david-dm.org/MichalLytek/type-graphql)
[![install size](https://packagephobia.now.sh/badge?p=type-graphql)](https://packagephobia.now.sh/result?p=type-graphql)
[![gitter](https://badges.gitter.im/type-graphql.svg)](https://gitter.im/type-graphql?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Create GraphQL schema and resolvers with TypeScript, using classes and decorators!

[**https://typegraphql.com/**](https://typegraphql.com/)
<br>
<br>
[![](https://opencollective.com/typegraphql/donate/button.png?color=white)](https://opencollective.com/typegraphql)

## Motivation

We all know that GraphQL is great and solves many problems we have with REST APIs, like overfetching and underfetching. But developing a GraphQL API in Node.js with TypeScript is sometimes a bit of a pain. Why? Let's take a look at the steps we usually have to take.

First, we create all the GraphQL types in `schema.gql` using SDL. Then we create our data models using [ORM classes](https://github.com/typeorm/typeorm), which represent our db entities. Then we start to write resolvers for our queries, mutations and fields, but this forces us to first create TS interfaces for all arguments, inputs, and even object types.

Only then can we actually implement the resolvers using weird generic signatures and manually performing common tasks, like validation, authorization and loading dependencies:

```ts
export const getRecipesResolver: GraphQLFieldResolver<void, Context, GetRecipesArgs> =
  async (_, args, ctx) => {
    // common tasks repeatable for almost every resolver
    const repository = TypeORM.getRepository(Recipe);
    const auth = Container.get(AuthService);
    await joi.validate(getRecipesSchema, args);
    if (!auth.check(ctx.user)) {
      throw new NotAuthorizedError();
    }

    // our business logic, e.g.:
    return repository.find({ skip: args.offset, take: args.limit });
  };
```

The biggest problem is redundancy in our codebase, which makes it difficult to keep things in sync. To add a new field to our entity, we have to jump through all the files - modify an entity class, the schema, as well as the interface. The same goes for inputs or arguments. It's easy to forget to update one piece or make a mistake with a single type. Also, what if we've made a typo in field name? The rename feature (F2) won't work correctly.

Tools like [GraphQL Code Generator](https://github.com/dotansimha/graphql-code-generator) or [graphqlgen](https://github.com/prisma/graphqlgen) only solve the first part - they generate the corresponding interfaces (and resolvers skeletons) for our GraphQL schema but they don't fix the schema <--> models redundancy and developer experience (F2 rename won't work, you have to remember about the codegen watch task in background, etc.), as well as common tasks like validation, authorization, etc.

**TypeGraphQL** comes to address these issues, based on experience from a few years of developing GraphQL APIs in TypeScript. The main idea is to have only one source of truth by defining the schema using classes and some help from decorators. Additional features like dependency injection, validation and auth guards help with common tasks that normally we would have to handle ourselves.

## Introduction

As mentioned, **TypeGraphQL** makes developing GraphQL APIs an enjoyable process, i.e. by defining the schema using only classes and a bit of decorator magic.

So, to create types like object type or input type, we use a kind of DTO classes.
For example, to declare `Recipe` type we simply create a class and annotate it with decorators:

```ts
@ObjectType()
class Recipe {
  @Field(type => ID)
  id: string;

  @Field()
  title: string;

  @Field(type => [Rate])
  ratings: Rate[];

  @Field({ nullable: true })
  averageRating?: number;
}
```

And we get the corresponding part of the schema in SDL:

```graphql
type Recipe {
  id: ID!
  title: String!
  ratings: [Rate!]!
  averageRating: Float
}
```

Then we can create queries, mutations and field resolvers. For this purpose we use controller-like classes that are called "resolvers" by convention. We can also use awesome features like dependency injection and auth guards:

```ts
@Resolver(Recipe)
class RecipeResolver {
  // dependency injection
  constructor(private recipeService: RecipeService) {}

  @Query(returns => [Recipe])
  recipes() {
    return this.recipeService.findAll();
  }

  @Mutation()
  @Authorized(Roles.Admin) // auth guard
  removeRecipe(@Arg("id") id: string): boolean {
    return this.recipeService.removeById(id);
  }

  @FieldResolver()
  averageRating(@Root() recipe: Recipe) {
    return recipe.ratings.reduce((a, b) => a + b, 0) / recipe.ratings.length;
  }
}
```

And in this simple way we get this part of the schema in SDL:

```graphql
type Query {
  recipes: [Recipe!]!
}

type Mutation {
  removeRecipe(id: String!): Boolean!
}
```

## Getting started

A full getting started guide with a simple walkthrough (tutorial) can be found at [getting started docs](https://typegraphql.com/docs/getting-started.html).

## Video tutorial

If you prefer video tutorials, you can watch [Ben Awad](https://github.com/benawad)'s [TypeGraphQL video series](https://www.youtube.com/playlist?list=PLN3n1USn4xlma1bBu3Tloe4NyYn9Ko8Gs) on YouTube.

## Documentation

The documentation, installation guide, detailed description of the API and all of its features is [available on the website](https://typegraphql.com/).

## Examples

You can also check the [examples folder](https://github.com/MichalLytek/type-graphql/tree/master/examples) in this repository for more examples of usage: simple fields resolvers, DI Container support, TypeORM integration, automatic validation, etc.

The [Tests folder](https://github.com/MichalLytek/type-graphql/tree/master/tests) might also give you some tips how to get various things done.

## Towards v1.0

The currently released version is a MVP (Minimum Viable Product). It is well tested (96% coverage, 8000 lines of test code) and has 95% of the planned features already implemented.

However there's still work to be done before the [1.0.0 release](https://github.com/MichalLytek/type-graphql/milestone/3) and it's mostly about documentation (website, api reference and jsdoc) and compatibility with the GraphQL spec and other tools.

There are also plans for more features like better TypeORM, Prisma and dataloader integration, custom decorators and metadata annotations support - [the full list of ideas](https://github.com/MichalLytek/type-graphql/issues?q=is%3Aissue+is%3Aopen+label%3A"Enhancement+%3Anew%3A") is available on the GitHub repo. You can also keep track of [development's progress on project board](https://github.com/MichalLytek/type-graphql/projects/1).

I encourage you to give TypeGraphQL a try and experiment with. If you have any questions, you can [ask on gitter](https://gitter.im/type-graphql/Lobby). If you find a bug, please report it as an issue on GitHub. If you have any interesting feature requests, I would be happy to hear about them.

## Support

TypeGraphQL is an MIT-licensed open source project. This framework is a result of the tremendous amount of work - sleepless nights, busy evenings and weekends.

It doesn't have a large company that sits behind - its ongoing development is possible only thanks to the support by the community.

[![](https://opencollective.com/typegraphql/donate/button.png?color=blue)](https://opencollective.com/typegraphql)

### Gold Sponsors 🏆

| [<img src="https://raw.githubusercontent.com/MichalLytek/type-graphql/master/img/blue_receipt.gif" width="450">](http://career.bluereceipt.co/) |
| :---: |
| [**BlueReceipt**](http://career.bluereceipt.co/) |

> Please ask your company to support this open source project by [becoming a gold sponsor](https://opencollective.com/typegraphql/contribute/gold-sponsors-8340) and getting a premium technical support from our core contributors.

### Silver Sponsors 🥈

| [<img src="https://raw.githubusercontent.com/MichalLytek/type-graphql/master/img/gorrion.png" width="250">](https://gorrion.io/) | [<img src="https://raw.githubusercontent.com/MichalLytek/type-graphql/master/img/mr-yum.png" width="100">](https://www.mryum.com/) |
| :---: | :---: |
| [**Gorrion Software House**](https://gorrion.io/) | [**Mr Yum**](https://www.mryum.com/) | 

### Bronze Sponsors 🥉

| [<img src="https://raw.githubusercontent.com/MichalLytek/type-graphql/master/img/live-graphics-system.png" width="60">](https://www.ligrsystems.com/) | [<img src="https://raw.githubusercontent.com/MichalLytek/type-graphql/master/img/lifex.png" width="75">](https://www.joinlifex.com/) | [<img src="https://raw.githubusercontent.com/MichalLytek/type-graphql/master/img/swiss-mentor.png" width="125">](https://www.swissmentor.com/) |
| :---: | :---: |  :---: |
| [**Live Graphic Systems**](https://www.ligrsystems.com/) | [**LifeX Aps**](https://www.joinlifex.com/) | [**SwissMentor**](https://www.swissmentor.com/) |

[![Become a Sponsor](https://opencollective.com/static/images/become_sponsor.svg)](https://opencollective.com/typegraphql)

### Members 💪 and Backers ☕

[![](https://opencollective.com/typegraphql/sponsors.svg?width=890&button=false)](https://opencollective.com/typegraphql#contributors)
[![](https://opencollective.com/typegraphql/backers.svg?width=890&button=false)](https://opencollective.com/typegraphql#contributors)

### Contribution

PRs are welcome, but first check, test and build your code before committing it.

- Use commit rules: For more information checkout this [commit rule guide](https://gist.github.com/stephenparish/9941e89d80e2bc58a153).
- [Allowing changes to a pull request branch created from a fork](https://help.github.com/articles/allowing-changes-to-a-pull-request-branch-created-from-a-fork/)

If you want to add a new big feature, please create a proposal first, where we can discuss the idea and implementation details. This will prevent wasted time if the PR be rejected.
