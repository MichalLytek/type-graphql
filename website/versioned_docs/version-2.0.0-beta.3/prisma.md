---
title: Prisma Integration
sidebar_label: Prisma
id: version-2.0.0-beta.3-prisma
original_id: prisma
---

TypeGraphQL provides an integration with Prisma by the [`typegraphql-prisma` package](https://www.npmjs.com/package/typegraphql-prisma).

It generates the type classes and CRUD resolvers based on the Prisma schema, so we can execute complex queries or mutations that corresponds to the Prisma actions, without having to write any code for that.

## Overview

To make use of the prisma integration, first we need to add a new generator to the `schema.prisma` file:

```sh
generator typegraphql {
  provider = "typegraphql-prisma"
}
```

Then, after running `prisma generate` we can import the generated resolvers classes and use them to build our schema:

```ts
import { resolvers } from "@generated/type-graphql";

const schema = await buildSchema({
  resolvers,
  validate: false,
});
```

So we will be able to execute a complex query, that talks with the real database, in just a few minutes!

```graphql
query GetSomeUsers {
  users(where: { email: { contains: "prisma" } }, orderBy: { name: desc }) {
    id
    name
    email
    posts(take: 10, orderBy: { updatedAt: desc }) {
      published
      title
      content
    }
  }
}
```

## Documentation and examples

To read about all the `typegraphql-prisma` features, like exposing selected Prisma actions or changing exposed model type name, as well as how to write a custom query or how to add some fields to model type, please check the docs [on the dedicated website](https://prisma.typegraphql.com).

There also can be found the links to some examples and more detailed info about the installation and the configuration.
