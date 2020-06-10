import "reflect-metadata";
import {
  Resolver,
  Query,
  buildSchema,
  FieldResolver,
  Ctx,
  Root,
} from "type-graphql";
import { ApolloServer } from "apollo-server";
import path from "path";
import { PrismaClient } from "@prisma/client";

import {
  User,
  Post,
  UserRelationsResolver,
  PostRelationsResolver,
  UserCrudResolver,
  PostCrudResolver,
} from "./prisma/generated/type-graphql";

interface Context {
  prisma: PrismaClient;
}

// custom resolver for custom business logic using Prisma Client
@Resolver(of => User)
class CustomUserResolver {
  @Query(returns => User, { nullable: true })
  async bestUser(@Ctx() { prisma }: Context): Promise<User | null> {
    return await prisma.user.findOne({
      where: { email: "bob@prisma.io" },
    });
  }

  @FieldResolver(type => Post, { nullable: true })
  async favoritePost(
    @Root() user: User,
    @Ctx() { prisma }: Context,
  ): Promise<Post | undefined> {
    const [favoritePost] = await prisma.user
      .findOne({ where: { id: user.id } })
      .posts({ take: 1 });

    return favoritePost;
  }
}

async function main() {
  const schema = await buildSchema({
    resolvers: [
      CustomUserResolver,
      UserRelationsResolver,
      UserCrudResolver,
      PostRelationsResolver,
      PostCrudResolver,
    ],
    emitSchemaFile: path.resolve(__dirname, "./generated-schema.graphql"),
    validate: false,
  });

  const prisma = new PrismaClient();

  const server = new ApolloServer({
    schema,
    playground: true,
    context: (): Context => ({ prisma }),
  });
  const { port } = await server.listen(4000);
  console.log(`GraphQL is listening on ${port}!`);
}

main().catch(console.error);
