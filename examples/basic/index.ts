import "reflect-metadata";
import {
  // ObjectType,
  Resolver,
  Query,
  buildSchema,
  FieldResolver,
} from "type-graphql";
import { ApolloServer } from "apollo-server";
import path from "path";

import {
  // BaseUser,
  // BasePost,
  BaseUser as User,
  BasePost as Post,
  UserRelationsResolver,
  PostRelationsResolver,
} from "./prisma/generated/type-graphql";
import Photon from "./prisma/generated/photon";

const photon = new Photon();

// @ObjectType()
// class User extends BaseUser {}

// @ObjectType()
// class Post extends BasePost {}

@Resolver(of => User)
class UserResolver {
  @Query(returns => [User])
  async users(): Promise<User[]> {
    return photon.users.findMany();
  }

  @FieldResolver()
  hello(): string {
    return "world!";
  }
}

@Resolver(of => Post)
class PostResolver {
  @Query(returns => [Post])
  async posts(): Promise<Post[]> {
    return photon.posts.findMany();
  }
}

async function main() {
  const schema = await buildSchema({
    resolvers: [
      UserResolver,
      UserRelationsResolver,
      PostResolver,
      PostRelationsResolver,
    ],
    emitSchemaFile: path.resolve(__dirname, "./generated-schema.graphql"),
  });

  const server = new ApolloServer({
    schema,
    playground: true,
    context: { photon },
  });
  const { port } = await server.listen(4000);
  console.log(`GraphQL is listening on ${port}!`);
}

main();
