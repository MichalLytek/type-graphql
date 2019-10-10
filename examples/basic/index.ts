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
import { Photon } from "@generated/photon";
import {
  BaseUser,
  BasePost,
  UserRelationsResolver,
  PostRelationsResolver,
  BaseUserCrudResolver,
  BasePostCrudResolver,
} from "./prisma/generated/type-graphql";

interface Context {
  photon: Photon;
}

// custom resolver for custom business logic using PhotonJS
@Resolver(of => BaseUser)
class CustomBaseUserResolver {
  @Query(returns => BaseUser)
  async bestUser(@Ctx() { photon }: Context): Promise<BaseUser> {
    return photon.users.findOne({
      where: { email: "bob@prisma.io" },
    });
  }

  @FieldResolver(type => BasePost, { nullable: true })
  async favoritePost(
    @Root() user: BaseUser,
    @Ctx() { photon }: Context,
  ): Promise<BasePost | undefined> {
    const [favoritePost] = await photon.users
      .findOne({ where: { id: user.id } })
      .posts({ first: 1 });
    return favoritePost;
  }
}

async function main() {
  const schema = await buildSchema({
    resolvers: [
      CustomBaseUserResolver,
      UserRelationsResolver,
      BaseUserCrudResolver,
      PostRelationsResolver,
      BasePostCrudResolver,
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

main();
