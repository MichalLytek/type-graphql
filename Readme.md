![integration logo](https://raw.githubusercontent.com/MichalLytek/type-graphql/prisma/img/integration.png)

# TypeGraphQL & Prisma 2 integration

Prisma 2 generator to emit TypeGraphQL type classes and resolvers

## Installation

Fist of all, you have to install the generator, as a dev dependency:

```sh
npm i -D typegraphql-prisma
```

You also need to install its peer deependency - `dataloader` - which is used for batching and caching the calls to `Prisma Client` in the relations resolvers:

```sh
npm i dataloader
```

## Configuration

After installation, you need to update your `schema.prisma` file and add a new generator section below the `client` one:

```prisma
generator client {
  provider = "prisma-client-js"
}

generator typegraphql {
  provider = "node_modules/typegraphql-prisma/generator.js"
}
```

Then after running `npx prisma2 generate`, this will emit the generated TypeGraphQL classes to `@generated/typegraphql-prisma` in `node_modules` folder. You can also configure the default output folder, e.g.:

```prisma
generator typegraphql {
  provider = "node_modules/typegraphql-prisma/generator.js"
  output   = "../prisma/generated/type-graphql"
}
```

## Usage

Given that you have this part of datamodel definitions:

```prisma
enum PostKind {
  BLOG
  ADVERT
}

model User {
  id    String  @default(cuid()) @id @unique
  email String  @unique
  name  String?
  posts Post[]
}
```

It will generate a `User` class in the output folder, with TypeGraphQL decorators, and an enum - you can import them and use normally as a type or an explicit type in your resolvers:

```ts
export enum PostKind {
  BLOG = "BLOG",
  ADVERT = "ADVERT",
}
registerEnumType(PostKind, {
  name: "PostKind",
  description: undefined,
});

@ObjectType({
  isAbstract: true,
  description: undefined,
})
export class User {
  @Field(_type => String, {
    nullable: false,
    description: undefined,
  })
  id!: string;

  @Field(_type => String, {
    nullable: false,
    description: undefined,
  })
  email!: string;

  @Field(_type => String, {
    nullable: true,
    description: undefined,
  })
  name?: string | null;

  posts?: Post[] | null;
}
```

It will also generates a whole bunch of stuffs based on your `schema.prisma` file - models classes, enums, as well as CRUD resolvers and relations resolver.

CRUD resolvers supports this following methods with args that are 1:1 matching with the `PrismaClient` API:

- findOne
- findMany
- create
- delete
- update
- deleteMany
- updateMany
- upsert
- aggregate

Also, if you want to have relations like `User -> posts` emitted in schema, you need to import the relations resolvers and register them in your `buildSchema` call:

```ts
import {
  User,
  UserRelationsResolver,
  UserCrudResolver,
} from "@generated/type-graphql";

const schema = await buildSchema({
  resolvers: [CustomUserResolver, UserRelationsResolver, UserCrudResolver],
  validate: false,
});
```

When using the generated resolvers, you have to first provide the `PrismaClient` instance into the context under `prisma` key, to make it available for the crud and relations resolvers:

```ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const server = new ApolloServer({
  schema,
  playground: true,
  context: (): Context => ({ prisma }),
});
```

### Customization

You can also add custom queries and mutations to the schema as always, using the generated `PrismaClient` client:

```ts
@Resolver()
export class CustomUserResolver {
  @Query(returns => User, { nullable: true })
  async bestUser(@Ctx() { prisma }: Context): Promise<User | null> {
    return await prisma.user.findOne({
      where: { email: "bob@prisma.io" },
    });
  }
}
```

If you want to add a field to the generated type like `User`, you have to add a proper `@FieldResolver` for that:

```ts
@Resolver(of => User)
export class CustomUserResolver {
  @FieldResolver(type => Post, { nullable: true })
  async favoritePost(
    @Root() user: User,
    @Ctx() { prisma }: Context,
  ): Promise<Post | undefined> {
    const [favoritePost] = await prisma.user
      .findOne({ where: { id: user.id } })
      .posts({ first: 1 });

    return favoritePost;
  }
}
```

If you want to expose only certain Prisma actions, like `findManyUser` or `createOneUser`, you can import resolver classes only for them, instead of the whole model `CrudResolver`.
Then you just have to put them into the `buildSchema`:

```ts
import {
  User,
  UserRelationsResolver,
  FindManyUserResolver,
  CreateOneUserResolver,
} from "@generated/type-graphql";

const schema = await buildSchema({
  resolvers: [
    CustomUserResolver,
    UserRelationsResolver,
    FindManyUserResolver,
    CreateOneUserResolver,
  ],
  validate: false,
});
```

## Examples

You can check out the basic integration example on this repo:

https://github.com/MichalLytek/type-graphql/tree/prisma/examples/basic

## Feedback

Currently released version `0.1.x` is just a preview of the upcoming integration. For now it lacks customization option - picking/omitting fields of object types to expose in the schema, as well as picking CRUD methods and exposed args.

However, the base functionality is working well, so I strongly encourage you to give it a try and play with it. Any feedback about the developers experience, bug reports or ideas about new features or enhancements are very welcome - please feel free to put your two cents into [discussion in the issue](https://github.com/MichalLytek/type-graphql/issues/476).

In near feature, when Prisma SDK will be ready, the `typegraphql-prisma` integration will also allow to use a code-first approach to build a `schema.prisma` and GraphQL schema at once, using classes with decorators as a single source of truth. Stay tuned! :muscle:
