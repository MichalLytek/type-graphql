<!-- prettier-ignore-start -->
<!-- markdownlint-disable-next-line MD041 -->
![logo](./images/logo.png)
<!-- prettier-ignore-end -->

# TypeGraphQL

[![release](https://github.com/MichalLytek/type-graphql/actions/workflows/release.yml/badge.svg)](https://github.com/MichalLytek/type-graphql/actions/workflows/release.yml)
[![website](https://github.com/MichalLytek/type-graphql/actions/workflows/website.yml/badge.svg)](https://github.com/MichalLytek/type-graphql/actions/workflows/website.yml)
[![codeql](https://github.com/MichalLytek/type-graphql/actions/workflows/codeql.yml/badge.svg)](https://github.com/MichalLytek/type-graphql/actions/workflows/codeql.yml)
[![discord](https://img.shields.io/discord/1195751245386875040?logo=discord&color=%237289da)](https://discord.gg/cWnBAQcbg2)
[![codecov](https://codecov.io/gh/MichalLytek/type-graphql/branch/master/graph/badge.svg)](https://codecov.io/gh/MichalLytek/type-graphql)
[![npm](https://img.shields.io/npm/v/type-graphql?logo=npm&color=%23CC3534)](https://www.npmjs.com/package/type-graphql)
[![open collective](https://opencollective.com/typegraphql/tiers/badge.svg)](https://opencollective.com/typegraphql)

Create [GraphQL](https://graphql.org) schema and resolvers with [TypeScript](https://www.typescriptlang.org), using classes and decorators!

**<https://typegraphql.com>**

[![donate](https://opencollective.com/typegraphql/donate/button.png?color=black)](https://opencollective.com/typegraphql)

## Introduction

**TypeGraphQL** makes developing GraphQL APIs an enjoyable process, i.e. by defining the schema using only classes and a bit of decorator magic.

So, to create types like object type or input type, we use a kind of DTO class.
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

Then we can create queries, mutations and field resolvers. For this purpose, we use controller-like classes that are called "resolvers" by convention. We can also use awesome features like dependency injection and auth guards:

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

And in this simple way, we get this part of the schema in SDL:

```graphql
type Query {
  recipes: [Recipe!]!
}

type Mutation {
  removeRecipe(id: String!): Boolean!
}
```

## Motivation

We all know that GraphQL is great and solves many problems we have with REST APIs, like Over-Fetching and Under-Fetching. But developing a GraphQL API in Node.js with TypeScript is sometimes a bit of a pain. Why? Let's take a look at the steps we usually have to take.

First, we create all the GraphQL types in `schema.graphql` using SDL. Then we create our data models using [ORM classes](https://github.com/typeorm/typeorm), which represent our DB entities. Then we start to write resolvers for our queries, mutations and fields, but this forces us to first create TS interfaces for all arguments, inputs, and even object types.

Only then can we implement the resolvers using weird generic signatures and manually performing common tasks, like validation, authorization and loading dependencies:

```ts
export const getRecipesResolver: GraphQLFieldResolver<void, Context, GetRecipesArgs> = async (
  _,
  args,
  ctx,
) => {
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

The biggest problem is redundancy in our codebase, which makes it difficult to keep things in sync. To add a new field to our entity, we have to jump through all the files - modify an entity class, the schema, as well as the interface. The same goes for inputs or arguments. It's easy to forget to update one piece or make a mistake with a single type. Also, what if we've made a typo in the field name? The rename feature (F2) won't work correctly.

Tools like [GraphQL Code Generator](https://github.com/dotansimha/graphql-code-generator) or [graphqlgen](https://github.com/prisma/graphqlgen) only solve the first part - they generate the corresponding interfaces (and resolvers skeletons) for our GraphQL schema but they don't fix the schema <--> models redundancy and developer experience (F2 rename won't work, you have to remember about the codegen watch task in the background, etc.), as well as common tasks like validation, authorization, etc.

**TypeGraphQL** comes to address these issues, based on experience from a few years of developing GraphQL APIs in TypeScript. The main idea is to have only one source of truth by defining the schema using classes and some help from decorators. Additional features like dependency injection, validation and auth guards help with common tasks that normally we would have to handle ourselves.

## Documentation

The documentation, installation guide, and detailed description of the API and all of its features are [available on the website](https://typegraphql.com).

### Getting started

A full getting started guide with a simple walkthrough (tutorial) can be found at [getting started docs](https://typegraphql.com/docs/getting-started.html).

### Video tutorial

If you prefer video tutorials, you can watch [Ben Awad](https://github.com/benawad)'s [TypeGraphQL video series](https://www.youtube.com/playlist?list=PLN3n1USn4xlma1bBu3Tloe4NyYn9Ko8Gs) on YouTube.

### Examples

You can also check the [examples folder](./examples) in this repository for more examples of usage: simple fields resolvers, DI Container support, TypeORM integration, automatic validation, etc.

The [Tests folder](./tests) might also give you some tips on how to get various things done.

## Security contact information

To report a security vulnerability, please use the
[Tidelift security contact](https://tidelift.com/security).
Tidelift will coordinate the fix and disclosure.

## The future

The currently released version is a stable 1.0.0 release. It is well-tested (97% coverage, ~500 test cases) and has most of the planned features already implemented. Plenty of companies and independent developers are using it in production with success.

However, there are also plans for a lot more features like better TypeORM, Prisma and DataLoader integration, custom decorators and metadata annotations support - [the full list of ideas](https://github.com/MichalLytek/type-graphql/issues?q=is%3Aissue+is%3Aopen+label%3A"Enhancement+%3Anew%3A") is available on the GitHub repo. You can also keep track of [development's progress on the project board](https://github.com/MichalLytek/type-graphql/projects/1).

If you have any interesting feature requests, feel free to open an issue on GitHub so we can discuss that!

## Support

**TypeGraphQL** is an MIT-licensed open-source project. This framework is a result of the tremendous amount of work - sleepless nights, busy evenings and weekends.

It doesn't have a large company that sits behind it - its ongoing development is possible only thanks to the support of the community.

[![donate](https://opencollective.com/typegraphql/donate/button.png?color=blue)](https://opencollective.com/typegraphql)

### Gold Sponsors 🏆

> Please ask your company to support this open source project by [becoming a gold sponsor](https://opencollective.com/typegraphql/contribute/gold-sponsors-8340) and getting a premium technical support from our core contributors.

### Silver Sponsors 🥈

<!-- markdownlint-disable MD033 -->

| [<img src="./images/leofame.png" width="250" alt="Leofame" />](https://leofame.com/buy-instagram-followers) |
| :---------------------------------------------------------------------------------------------------------: |
|                         [**Leofame**](https://leofame.com/buy-instagram-followers)                          |

### Bronze Sponsors 🥉

| [<img src="./images/live-graphics-system.png" width="55" alt="live graphic systems" />](https://www.ligrsystems.com) | [<img src="./images/felix.png" width="60" alt="Felix Technologies" />](https://github.com/joinlifex) | [<img src="./images/instinctools.svg" width="100" alt="instinctools" />](https://instinctools.com/manufacturing) |
| :------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------: |
|                               [**Live Graphic Systems**](https://www.ligrsystems.com)                                |                       [**Felix Technologies**](https://github.com/joinlifex/)                        |                            [**instinctools**](https://instinctools.com/manufacturing)                            |

| [<img src="./images/betwinner.svg" width="100" alt="BetWinner" />](https://guidebook.betwinner.com/) | [<img src="./images/famety.png" width="40" alt="Famety" />](https://www.famety.com/buy-instagram-likes) | [<img src="./images/logo-buzzv.png" width="70" alt="BuzzVoice" />](https://buzzvoice.com/) | [<img src="./images/socialwick-logo.png" width="60" alt="SocialWick" />](https://www.socialwick.com/) | [<img src="./images/nove_casino.svg" width="70" alt="Nove Casino" />](https://novecasino.net/) | [<img src="./images/play_fortune.png" width="80" alt="Play Fortune" />](https://play-fortune.pl/gry-online/jednoreki-bandyta/) | [<img src="./images/best-casino.png" width="40" alt="Best Online Casino" />](https://www.reddit.com/r/GamingInsider/comments/1m1nt3p/best_gambling_site_need_online_casino/) | [<img src="./images/moonkasyno.png" width="60" alt="MoonKasyno" />](https://wechoosethemoon.org/kasyna-online/) | [<img src="./images/kasyno-online.png" width="50" alt="Kasyno Online" />](https://www.casinobillions.com/pl/) |
| :--------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------: |
|                          [**BetWinner**](https://guidebook.betwinner.com/)                           |                        [**Famety**](https://www.famety.com/buy-instagram-likes)                         |                          [**BuzzVoice**](https://buzzvoice.com/)                           |                             [**SocialWick**](https://www.socialwick.com/)                             |                           [**Nove Casino**](https://novecasino.net/)                           |                           [**Play Fortune**](https://play-fortune.pl/gry-online/jednoreki-bandyta/)                            |                           [**Best Online Casino**](https://www.reddit.com/r/GamingInsider/comments/1m1nt3p/best_gambling_site_need_online_casino/)                           |                          [**MoonKasyno**](https://wechoosethemoon.org/kasyna-online/)                           |                            [**Kasyno Online**](https://www.casinobillions.com/pl/)                            |

| [<img src="./images/sidesmedia.png" width="40" alt="SidesMedia" />](https://sidesmedia.com/) | [<img src="./images/social_followers.png" width="60" alt="Social Followers" />](https://www.socialfollowers.uk/buy-tiktok-followers/) | [<img src="./images/ig-comment.png" width="80" alt="IG Comment" />](https://igcomment.com/buy-instagram-comments/) | [<img src="./images/twicsy.svg" width="100" alt="Twicsy" />](https://twicsy.com/buy-instagram-followers) | [<img src="./images/buzzoid.svg" width="90" alt="Buzzoid" />](https://buzzoid.com/buy-instagram-followers/) | [<img src="./images/tiktok-expert.jpg" width="60" alt="TikTok Expert" />](https://www.reddit.com/r/TikTokExpert/comments/1f812o7/best_and_cheapest_site_to_buy_tiktok_followers/) | [<img src="./images/v4u.png" width="80" alt="Views4You" />](https://views4you.com/) | [<img src="./images/socialift.png" width="60" alt="Socialift" />](https://www.socialift.io/buy-youtube-views) | [<img src="./images/the-yt-views.png" width="50" alt="The Yt Views" />](https://theytviews.com) |
| :------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------: |
|                          [**SidesMedia**](https://sidesmedia.com/)                           |                             [**Social Followers**](https://www.socialfollowers.uk/buy-tiktok-followers/)                              |                          [**IG Comment**](https://igcomment.com/buy-instagram-comments/)                           |                         [**Twicsy**](https://twicsy.com/buy-instagram-followers)                         |                         [**Buzzoid**](https://buzzoid.com/buy-instagram-followers/)                         |                            [**TikTok Expert**](https://www.reddit.com/r/TikTokExpert/comments/1f812o7/best_and_cheapest_site_to_buy_tiktok_followers/)                            |                       [**Views4You**](https://views4you.com/)                       |                          [**Socialift**](https://www.socialift.io/buy-youtube-views)                          |                           [**The Yt Views**](https://theytviews.com)                            |

<!-- markdownlint-enable MD033 -->

[![become a sponsor](https://opencollective.com/static/images/become_sponsor.svg)](https://opencollective.com/typegraphql)

### Members 💪

[![Members](https://opencollective.com/typegraphql/tiers/members.svg?avatarHeight=45&width=320&button=false)](https://opencollective.com/typegraphql#contributors)

### GitHub Sponsors

[![GitHub Sponsors](./images/github-sponsors.svg)](https://github.com/sponsors/TypeGraphQL)

## Community

- Visit the [Official Website](https://typegraphql.com)
- Chat on [Discord](https://discord.gg/cWnBAQcbg2)

## Want to help?

Want to file a bug, contribute some code, or improve the documentation? Great! Please read our
guidelines for [CONTRIBUTING](./CONTRIBUTING.md) and then check out one of our [help-wanted issues](https://github.com/MichalLytek/type-graphql/labels/Help%20Wanted%20%3Asos%3A).
