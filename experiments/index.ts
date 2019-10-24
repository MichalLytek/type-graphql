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

import { User } from "./prisma/generated/type-graphql/models/User";
// import { User as BaseUser } from "./prisma/generated/type-graphql/models/User";
import { Post } from "./prisma/generated/type-graphql/models/Post";
// import { Post as BasePost } from "./prisma/generated/type-graphql/models/Post";
import { UserRelationsResolver } from "./prisma/generated/type-graphql/resolvers/UserRelationsResolver";
import { UserCrudResolver } from "./prisma/generated/type-graphql/resolvers/UserCrudResolver";
import { PostRelationsResolver } from "./prisma/generated/type-graphql/resolvers/PostRelationsResolver";
import { PostCrudResolver } from "./prisma/generated/type-graphql/resolvers/PostCrudResolver";
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
    // debug: true,
  });

  const server = new ApolloServer({
    schema,
    playground: true,
    context: (): Context => ({ photon }),
  });
  const { port } = await server.listen(4000);
  console.log(`GraphQL is listening on ${port}!`);
}

main().catch(console.error);
