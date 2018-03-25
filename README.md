![logo](https://github.com/19majkel94/type-graphql/blob/master/logo.png?raw=true)

# TypeGraphQL
[![npm version](https://badge.fury.io/js/type-graphql.svg)](https://badge.fury.io/js/type-graphql)
[![Build Status](https://travis-ci.org/19majkel94/type-graphql.svg?branch=master)](https://travis-ci.org/19majkel94/type-graphql)
[![codecov](https://codecov.io/gh/19majkel94/type-graphql/branch/master/graph/badge.svg)](https://codecov.io/gh/19majkel94/type-graphql)
[![dependencies](https://david-dm.org/19majkel94/type-graphql/status.svg)](https://david-dm.org/19majkel94/type-graphql)
[![gitter](https://badges.gitter.im/type-graphql.svg)](https://gitter.im/type-graphql?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Create GraphQL schema and resolvers with TypeScript, using classes and decorators!

## Introduction
We all know that GraphQL is so great and solves many problems that we have with REST API, like overfetching and underfetching. But developing a GraphQL API in Node.js with TypeScript is sometimes a bit of pain. **TypeGraphQL** makes that process enjoyable, i.a. by defining the schema using only classes and a bit of decorators magic.

To create types like object type or input type, we use kind of DTO classes. For example to declare `Recipe` type we simply create a class and annotate it with decorators:
```ts
@ObjectType()
class Recipe {
  @Field(type => ID)
  id: string;

  @Field()
  title: string;

  @Field(type => [Rate])
  ratings: Rate[]

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

Then we can create queries, mutations and field resolvers.
For this purpose we use controller-like classes that are called "resolvers" by convention.
We can also use awesome features like dependency injection or auth guards:
```ts
@Resolver(Recipe)
class RecipeResolver {
  constructor(
    private recipeService: RecipeService,
  ) {}

  @Query(returns => [Recipe])
  recipes() {
    return this.recipeService.findAll();
  }

  @Mutation()
  @Authorized(Roles.Admin)
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

Why I said that developing a GraphQL API in Node.js with TypeScript is sometimes a bit of pain? You can find out what's [the motivation of creating TypeGraphQL](https://github.com/19majkel94/type-graphql/blob/master/docs/introduction.md#motivation) in docs.

## Getting started
Full getting started guide with a simple walkthrough/tutorial can be found in [getting started docs](https://github.com/19majkel94/type-graphql/blob/master/docs/getting-started.md).
Below you can find installation instructions that are also important.

## How to use

### Installation

1. Install module:
```
npm i type-graphql
```

2. `reflect-metadata` shim is required:
```
npm i reflect-metadata
```

and make sure to import it on top of your entry file (before you use/import `type-graphql` or your resolvers):
```ts
import "reflect-metadata";
```

### TypeScript configuration

3. Its important to set these options in `tsconfig.json` file of your project:
```js
{
  "emitDecoratorMetadata": true,
  "experimentalDecorators": true
}
```

4. `TypeGraphQL` is designed to work with Node.js 6, 8 and latest stable. It uses features from ES7 (ES2016) so you should set your `tsconfig.json` appropriately:
```js
{
  "target": "ES2016" // or newer if your node.js version supports this
}
```

## Examples
You can also check the [examples](https://github.com/19majkel94/type-graphql/tree/master/examples) folder on the repo for more example of usage: simple fields resolvers, DI Container support, TypeORM integration, automatic validation, etc.

Please notice that, do tue a [ts-node bug](https://github.com/rbuckton/reflect-metadata/issues/84) an additional parameter is needed when running with ts-node:
```bash
ts-node --type-check ./examples/simple-usage/index.ts
```

The [Tests folder](https://github.com/19majkel94/type-graphql/tree/master/tests) might also give you some tips how to make some things done.

## Work in progress
Currently released version is a MVP (Minimum Viable Product).
It is well tested (95% coverage, 4400 lines of test code) and has 90% of the planned features already implemented.
However there's some work to do before 1.0.0 release and it's mostly about documentation (website, api reference and jsdoc).

There are also plans for more features like better TypeORM and dataloader integration or middlewares and custom decorators support - [the full list of ideas](https://github.com/19majkel94/type-graphql/issues?q=is%3Aissue+is%3Aopen+label%3A"Enhancement+%3Anew%3A") is available on the GitHub repo. You can also keep track of [development's progress on project board](https://github.com/19majkel94/type-graphql/projects/1).

I encourage you to give it a try and experiment with TypeGraphQL. If you have any question, you can [ask about it on gitter](https://gitter.im/type-graphql/Lobby). If you find a bug, please report it as an issue on GitHub. If you have an interesting feature request, I will be happy to hear about it. 

## Contribution
PRs are welcome, but first check, test and build your code before committing it.
* Use commit rules: For more information checkout this [commit rule guide](https://gist.github.com/stephenparish/9941e89d80e2bc58a153).
* [Allowing changes to a pull request branch created from a fork](https://help.github.com/articles/allowing-changes-to-a-pull-request-branch-created-from-a-fork/)

If you want to add a new big feature, please create a proposal first, where we can discuss the idea and implementation details. This will prevent wasting of your time if the PR be rejected.
