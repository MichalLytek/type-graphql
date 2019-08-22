import "reflect-metadata";
import {
  ObjectType,
  Resolver,
  Query,
  buildSchema,
  FieldResolver,
  Root,
  ResolverInterface,
} from "type-graphql";
import { ApolloServer } from "apollo-server";
import path from "path";

import { BaseUser, BasePost } from "../prisma/generated/type-graphql";
import Photon from "../prisma/generated/photon";

const photon = new Photon();

@ObjectType()
class User extends BaseUser {}

@ObjectType()
class Post extends BasePost {}

@Resolver(of => User)
class UserResolver implements ResolverInterface<User> {
  @Query(returns => [User])
  async users(): Promise<User[]> {
    return photon.users.findMany();
  }

  @FieldResolver(returns => [Post])
  async posts(@Root() user: User): Promise<Post[]> {
    return photon.users.findOne({ where: { id: user.id } }).posts();
  }

  @FieldResolver()
  hello(): string {
    return "world!";
  }
}

@Resolver(of => Post)
class PostResolver implements ResolverInterface<Post> {
  @Query(returns => [Post])
  async posts(): Promise<Post[]> {
    return photon.posts.findMany();
  }

  @FieldResolver(returns => User, { nullable: true })
  async author(@Root() post: Post): Promise<User | null> {
    return photon.posts.findOne({ where: { id: post.id } }).author();
  }
}

async function main() {
  const schema = await buildSchema({
    resolvers: [UserResolver, PostResolver],
    emitSchemaFile: path.resolve(__dirname, "./generated-schema.graphql"),
  });

  const server = new ApolloServer({ schema, playground: true });
  const { port } = await server.listen(4000);
  console.log(`GraphQL is listening on ${port}!`);
}

main();
