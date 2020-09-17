import "reflect-metadata";
import {
  // ObjectType,
  Resolver,
  Query,
  buildSchema,
  FieldResolver,
  Ctx,
  Args,
} from "type-graphql";
import { ApolloServer } from "apollo-server";
import path from "path";

import {
  Client,
  ClientRelationsResolver,
  ClientCrudResolver,
  Post,
  PostRelationsResolver,
  FindOnePostResolver,
  CreatePostResolver,
  UpdateManyPostResolver,
  // Category,
  CategoryCrudResolver,
  // Patient,
  PatientCrudResolver,
  FindManyPostResolver,
  MovieCrudResolver,
  DirectorCrudResolver,
  DirectorRelationsResolver,
  MovieRelationsResolver,
  FindManyClientArgs,
  ProblemRelationsResolver,
  CreatorRelationsResolver,
} from "./prisma/generated/type-graphql";
import { PrismaClient } from "./prisma/generated/client";
import * as Prisma from "./prisma/generated/client";
import { ProblemCrudResolver } from "./prisma/generated/type-graphql/resolvers/crud/Problem/ProblemCrudResolver";
import { CreatorCrudResolver } from "./prisma/generated/type-graphql/resolvers/crud/Creator/CreatorCrudResolver";

interface Context {
  prisma: PrismaClient;
}

@Resolver(of => Client)
class ClientResolver {
  @Query(returns => [Client])
  async allClients(@Ctx() { prisma }: Context): Promise<Prisma.User[]> {
    return await prisma.user.findMany();
  }

  @Query(returns => [Client])
  async customFindClientsWithArgs(
    @Args() args: FindManyClientArgs,
    @Ctx() { prisma }: Context,
  ): Promise<Prisma.User[]> {
    return prisma.user.findMany(args);
  }

  @FieldResolver()
  hello(): string {
    return "world!";
  }
}

@Resolver(of => Post)
class PostResolver {
  @Query(returns => [Post])
  async allPosts(@Ctx() { prisma }: Context): Promise<Post[]> {
    return (await prisma.post.findMany()) as Post[];
  }
}

async function main() {
  const schema = await buildSchema({
    resolvers: [
      ClientResolver,
      ClientRelationsResolver,
      ClientCrudResolver,
      PostResolver,
      PostRelationsResolver,
      FindOnePostResolver,
      CreatePostResolver,
      UpdateManyPostResolver,
      CategoryCrudResolver,
      PatientCrudResolver,
      FindManyPostResolver,
      MovieCrudResolver,
      MovieRelationsResolver,
      DirectorCrudResolver,
      DirectorRelationsResolver,
      ProblemCrudResolver,
      CreatorCrudResolver,
      ProblemRelationsResolver,
      CreatorRelationsResolver,
    ],
    validate: false,
    emitSchemaFile: path.resolve(__dirname, "./generated-schema.graphql"),
  });

  const prisma = new PrismaClient({
    // see dataloader for relations in action
    log: ["query"],
  });

  const server = new ApolloServer({
    schema,
    playground: true,
    context: (): Context => ({ prisma }),
  });
  const { port } = await server.listen(4000);
  console.log(`GraphQL is listening on ${port}!`);
}

main().catch(console.error);
