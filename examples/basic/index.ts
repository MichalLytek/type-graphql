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
import { Photon } from "@prisma/photon";

import {
  User,
  Post,
  UserRelationsResolver,
  PostRelationsResolver,
  UserCrudResolver,
  PostCrudResolver,
} from "./prisma/generated/type-graphql";

interface Context {
  photon: Photon;
}

// custom resolver for custom business logic using PhotonJS
@Resolver(of => User)
class CustomUserResolver {
  @Query(returns => User, { nullable: true })
  async bestUser(@Ctx() { photon }: Context): Promise<User | null> {
    return await photon.users.findOne({
      where: { email: "bob@prisma.io" },
    });
  }

  @FieldResolver(type => Post, { nullable: true })
  async favoritePost(
    @Root() user: User,
    @Ctx() { photon }: Context,
  ): Promise<Post | undefined> {
    const [favoritePost] = await photon.users
      .findOne({ where: { id: user.id } })
      .posts({ first: 1 });

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

main().catch(console.error);
