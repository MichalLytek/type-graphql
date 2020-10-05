---
title: Prisma 2 Integration
sidebar_label: Prisma 2
---

TypeGraphQL provides an integration with Prisma 2 by the [`typegraphql-prisma` package](https://www.npmjs.com/package/typegraphql-prisma).

It generates the type classes and CRUD resolvers based on the Prisma schema, so you can execute complex queries or mutations that corresponds to the Prisma actions, without having to write any code for that.

## Overview

To make use of the prisma integration, first you need to add a new generator to the `schema.prisma` file:

```sh
generator typegraphql {
  provider = "typegraphql-prisma"
  output   = "../src/generated/typegraphql-prisma"
}
```

Then, after running `prisma generate` you can import the generated classes and use them to build your schema:

```typescript
import { User, UserRelationsResolver, UserCrudResolver } from "./generated/typegraphql-prisma";

const schema = await buildSchema({
  resolvers: [CustomUserResolver, UserRelationsResolver, UserCrudResolver],
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

To read about all the `typegraphql-prisma` features, like exposing selected Prisma actions or changing exposed model type name, as well as how to write a custom query or how to add some fields to model type, please check the docs [on the separate GitHub repository](https://github.com/MichalLytek/typegraphql-prisma/blob/main/Readme.md).

You can find there also some examples and more detailed info about the installation and the configuration.
