![logo](https://github.com/19majkel94/type-graphql/blob/master/logo.png?raw=true)

# TypeGraphQL

[![npm version](https://badge.fury.io/js/type-graphql.svg)](https://badge.fury.io/js/type-graphql)
[![Build Status](https://travis-ci.org/19majkel94/type-graphql.svg?branch=master)](https://travis-ci.org/19majkel94/type-graphql)
[![codecov](https://codecov.io/gh/19majkel94/type-graphql/branch/master/graph/badge.svg)](https://codecov.io/gh/19majkel94/type-graphql)
[![dependencies](https://david-dm.org/19majkel94/type-graphql/status.svg)](https://david-dm.org/19majkel94/type-graphql)
[![install size](https://packagephobia.now.sh/badge?p=type-graphql)](https://packagephobia.now.sh/result?p=type-graphql)
[![gitter](https://badges.gitter.im/type-graphql.svg)](https://gitter.im/type-graphql?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Create GraphQL schema and resolvers with TypeScript, using classes and decorators!

https://19majkel94.github.io/type-graphql/

## Motivation

We all know that GraphQL is so great and solves many problems that we have with REST API, like overfetching and underfetching. But developing a GraphQL API in Node.js with TypeScript is sometimes a bit of pain. Why? Let's take a look at the steps we usually have to make.

At first, we create the all the GraphQL types in `schema.gql` using SDL. We also create our data models using [ORM classes](https://github.com/typeorm/typeorm), which represents our db entities. Then we start to write resolvers for our queries, mutations and fields, but this forces us to first create TS interfaces for all arguments, inputs, and even object types.

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

The biggest problem is the redundancy in our codebase, which makes it difficult to keep things in sync. To add a new field to our entity, we have to jump through all the files - modify an entity class, the schema, as well as the interface. The same goes with inputs or arguments. It's easy to forget to update one piece or make a mistake with a single type. Also, what if we've made a typo in field name? The rename feature (F2) won't work correctly.

Tools like [GraphQL Code Generator](https://github.com/dotansimha/graphql-code-generator) or [graphqlgen](https://github.com/prisma/graphqlgen) only solves the first part - they generate the corresponding interfaces (and resolvers skeletons) for our GraphQL schema but they won't fix the schema <--> models redundancy and developer experience (F2 rename won't work, yoi have to remember about codegen watch task in background, etc.), as well as the common tasks like validation, authorization, etc.

**TypeGraphQL** comes to address this issues, based on experience from a few years of developing GraphQL APIs in TypeScript. The main idea is to have only one source of truth by defining the schema using classes and a bit of decorators help. Additional features like dependency injection, validation or auth guards helps with common tasks that normally we would have to handle by ourselves.

## Introduction

As I mentioned, **TypeGraphQL** makes developing a GraphQL API and enjoyable process, i.e. by defining the schema using only classes and a bit of decorator magic.

So, to create types like object type or input type, we use kind of DTO classes.
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

And we get corresponding part of schema in SDL:

```graphql
type Recipe {
  id: ID!
  title: String!
  ratings: [Rate!]!
  averageRating: Float
}
```

Then we can create queries, mutations and field resolvers. For this purpose we use controller-like classes that are called "resolvers" by convention. We can also use awesome features like dependency injection or auth guards:

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

And in this simple way we get this part of schema in SDL:

```graphql
type Query {
  recipes: [Recipe!]!
}

type Mutation {
  removeRecipe(id: String!): Boolean!
}
```

## Getting started

Full getting started guide with a simple walkthrough (tutorial) can be found in [getting started docs](https://19majkel94.github.io/type-graphql/docs/getting-started.html).

## Documentation

The documentation with installation guide, detailed description of the API and all the features is [available on the website](https://19majkel94.github.io/type-graphql/).

## Examples

You can also check the [examples folder](https://github.com/19majkel94/type-graphql/tree/master/examples) on this repository for more examples of usage: simple fields resolvers, DI Container support, TypeORM integration, automatic validation, etc.

The [Tests folder](https://github.com/19majkel94/type-graphql/tree/master/tests) might also give you some tips how to get various things done.

## Towards v1.0

Currently released version is a MVP (Minimum Viable Product). It is well tested (96% coverage, 8000 lines of test code) and has 95% of the planned features already implemented.

However there's some work to do before [1.0.0 release](https://github.com/19majkel94/type-graphql/milestone/3) and it's mostly about documentation (website, api reference and jsdoc) and compatibility with GraphQL spec or other tools.

There are also plans for more features like better TypeORM, Prisma and dataloader integration or custom decorators and metadata annotations support - [the full list of ideas](https://github.com/19majkel94/type-graphql/issues?q=is%3Aissue+is%3Aopen+label%3A"Enhancement+%3Anew%3A") is available on the GitHub repo. You can also keep track of [development's progress on project board](https://github.com/19majkel94/type-graphql/projects/1).

I encourage you to give it a try and experiment with TypeGraphQL. If you have any question, you can [ask about it on gitter](https://gitter.im/type-graphql/Lobby). If you find a bug, please report it as an issue on GitHub. If you have an interesting feature request, I will be happy to hear about it.

## Contribution

PRs are welcome, but first check, test and build your code before committing it.

- Use commit rules: For more information checkout this [commit rule guide](https://gist.github.com/stephenparish/9941e89d80e2bc58a153).
- [Allowing changes to a pull request branch created from a fork](https://help.github.com/articles/allowing-changes-to-a-pull-request-branch-created-from-a-fork/)

If you want to add a new big feature, please create a proposal first, where we can discuss the idea and implementation details. This will prevent wasting of your time if the PR be rejected.
