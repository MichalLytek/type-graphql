import "reflect-metadata";
import { ObjectType, Resolver, Query, buildSchema } from "type-graphql";
import { ApolloServer } from "apollo-server";

import { BaseUser, BasePost } from "../prisma/generated";
import Photon from "@generated/photon";

const photon = new Photon();

@ObjectType()
class User extends BaseUser {}

@ObjectType()
class Post extends BasePost {}

@Resolver(of => User)
class UserResolver {
  @Query(returns => [User])
  async users(): Promise<User[]> {
    // console.log(await photon.users.findMany());
    return photon.users.findMany();
  }
}

@Resolver(of => Post)
class PostResolver {
  @Query(returns => [Post])
  async posts(): Promise<Post[]> {
    // console.log(await photon.posts.findMany());
    return photon.posts.findMany();
  }
}

async function main() {
  const schema = await buildSchema({
    resolvers: [UserResolver, PostResolver],
  });

  const server = new ApolloServer({ schema, playground: true });
  const { port } = await server.listen(4000);
  console.log(`GraphQL is listening on ${port}!`);
}

main();
