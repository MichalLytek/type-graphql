---
title: AdonisJS Integration
sidebar_label: AdonisJS
id: version-2.0.0-rc.2-adonisjs
original_id: adonisjs
---

[`@foadonis/graphql`](https://friendsofadonis.com/docs/graphql) is a fully featured package to build GraphQL APIs with [AdonisJS](https://adonisjs.com/) powered by TypeGraphQL and [Apollo Server](https://www.apollographql.com/docs/apollo-server).

It supports subscriptions out of the box and brings scalars for [Luxon](https://moment.github.io/luxon/#/) and [VineJS](https://vinejs.dev/). It also provide some helpers for authorization to create a seamless experience for building GraphQL APIs.

## Overview

To get started on an existing AdonisJS project a single command is required, it will install all the required dependencies and generate configuration files:

```sh
node ace add @foadonis/graphql
```

Once done, you can start your AdonisJS application and access [http://localhost:3000/graphql](http://localhost:3000/graphql) that will great you with the [Apollo Sandbox](https://www.apollographql.com/docs/apollo-sandbox).

You can create your first resolver like so:

```ts
import Recipe from "#models/recipe";
import { Query, Resolver } from "@foadonis/graphql";

@Resolver()
export default class RecipeResolver {
  @Query(() => [Recipe])
  recipes() {
    return Recipe.query();
  }
}
```

Register your freshly created resolver in `start/graphql.ts`:

```ts
import graphql from "@foadonis/graphql/services/main";

graphql.resolvers([() => import("#graphql/resolvers/recipe_resolver")]);
```

## Documentation

You can find more information on the [package documentation website](https://friendsofadonis.com/docs/graphql).
