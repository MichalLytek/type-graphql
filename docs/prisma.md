---
title: Prisma Integration
sidebar_label: Prisma
---

TypeGraphQL provides an integration with Prisma by the [`typegraphql-prisma` package](https://www.npmjs.com/package/typegraphql-prisma).

It generates the type classes and CRUD resolvers based on the Prisma schema, so you can execute complex queries or mutations that corresponds to the Prisma actions, without having to write any code for that.

## Overview

To make use of the prisma integration, first you need to add a new generator to the `schema.prisma` file:

```sh
generator typegraphql {
  provider = "typegraphql-prisma"
}
```

Then, after running `prisma generate` you can import the generated resolvers classes and use them to build your schema:

```typescript
import { resolvers } from "@generated/type-graphql";

const schema = await buildSchema({
  resolvers,
  validate: false,
});
```

So you will be able to execute such complex query that talks with the db in just a few minutes!

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

To read about all the `typegraphql-prisma` features, like exposing selected Prisma actions or changing exposed model type name, as well as how to write a custom query or how to add some fields to model type, please check the docs [on the dedicated website](https://prisma.typegraphql.com/).

You can find there also links to some examples and more detailed info about the installation and the configuration.
