import "reflect-metadata";
import path from "path";
import { PrismaClient } from "@prisma/client";
import { Resolver, Query, FieldResolver, Ctx, Root } from "type-graphql";
import { TypeGraphQLModule } from "typegraphql-nestjs";
import { NestFactory } from "@nestjs/core";
import { Module } from "@nestjs/common";
import {
  NestFastifyApplication,
  FastifyAdapter,
} from "@nestjs/platform-fastify";

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
  const prisma = new PrismaClient();

  @Module({
    imports: [
      // use the TypeGraphQLModule to expose Prisma by GraphQL
      TypeGraphQLModule.forRoot({
        playground: true,
        introspection: true,
        path: "/",
        emitSchemaFile: path.resolve(__dirname, "./generated-schema.graphql"),
        validate: false,
        context: (): Context => ({ prisma }),
      }),
    ],
    providers: [
      // register all resolvers inside `providers` of the Nest module
      CustomUserResolver,
      UserRelationsResolver,
      UserCrudResolver,
      PostRelationsResolver,
      PostCrudResolver,
    ],
  })
  class AppModule {}

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  await app.listen(4000);
  console.log(`GraphQL is listening on 4000!`);
}

main().catch(console.error);
