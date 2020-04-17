import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { ApolloServer } from "apollo-server";
import path from "path";
import { PrismaClient } from "@prisma/client";

import {
  UserRelationsResolver,
  PostRelationsResolver,
  FindOnePostResolver,
  FindManyPostResolver,
  FindOneUserResolver,
  FindManyUserResolver,
  AggregatePostResolver,
  AggregateUserResolver,
  // PostCrudResolver,
  // UserCrudResolver,
} from "./prisma/generated/type-graphql";

interface Context {
  prisma: PrismaClient;
}

async function main() {
  const schema = await buildSchema({
    resolvers: [
      UserRelationsResolver,
      PostRelationsResolver,
      // instead of PostCrudResolver, expose only find and aggregate  actions
      FindOnePostResolver,
      FindManyPostResolver,
      AggregatePostResolver,
      // instead of UserCrudResolver, expose only find and aggregate actions
      FindOneUserResolver,
      FindManyUserResolver,
      AggregateUserResolver,
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
