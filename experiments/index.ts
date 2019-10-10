import "reflect-metadata";
import {
  // ObjectType,
  Resolver,
  Query,
  buildSchema,
  FieldResolver,
  Ctx,
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
  BaseUserCrudResolver as UserCrudResolver,
  BasePostCrudResolver as PostCrudResolver,
} from "./prisma/generated/type-graphql";
import { Photon } from "./prisma/generated/photon";

// @ObjectType()
// class User extends BaseUser {}

// @ObjectType()
// class Post extends BasePost {}

interface Context {
  photon: Photon;
}

@Resolver(of => User)
class UserResolver {
  @Query(returns => [User])
  async users(@Ctx() { photon }: Context): Promise<User[]> {
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
  async posts(@Ctx() { photon }: Context): Promise<Post[]> {
    return photon.posts.findMany();
  }
}

async function main() {
  const schema = await buildSchema({
    resolvers: [
      UserResolver,
      UserRelationsResolver,
      UserCrudResolver,
      PostResolver,
      PostRelationsResolver,
      PostCrudResolver,
    ],
    validate: false,
    emitSchemaFile: path.resolve(__dirname, "./generated-schema.graphql"),
  });

  const photon = new Photon({
    // debug: true, // uncomment to see how dataloader for relations works
  });

  const server = new ApolloServer({
    schema,
    playground: true,
    context: (): Context => ({ photon }),
  });
  const { port } = await server.listen(4000);
  console.log(`GraphQL is listening on ${port}!`);
}

main();
