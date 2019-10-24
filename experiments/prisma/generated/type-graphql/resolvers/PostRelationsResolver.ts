import { registerEnumType, ObjectType, Field, Int, Float, ID, Resolver, FieldResolver, Root, Ctx, InputType, Query, Mutation, Arg, ArgsType, Args } from "type-graphql";
import DataLoader from "dataloader";
import { User } from "../models/User";
import { Post } from "../models/Post";

function createGetPostAuthorDataLoader(photon: any) {
  const argsToDataLoaderMap = new Map<string, DataLoader<string, User>>();
  return function getPostAuthorDataLoader(args: any) {
    const argsJSON = JSON.stringify(args);
    let postAuthorDataLoader = argsToDataLoaderMap.get(argsJSON);
    if (!postAuthorDataLoader) {
      postAuthorDataLoader = new DataLoader<string, User>(async keys => {
        const fetchedData: any[] = await photon.posts.findMany({
          where: { uuid: { in: keys } },
          select: {
            uuid: true,
            author: args,
          },
        });
        return keys
          .map(key => fetchedData.find(data => data.uuid === key)!)
          .map(data => data.author);
      });
      argsToDataLoaderMap.set(argsJSON, postAuthorDataLoader);
    }
    return postAuthorDataLoader;
  }

}

@Resolver(_of => Post)
export class PostRelationsResolver {
  @FieldResolver(_type => User, {
    nullable: false,
    description: undefined,
  })
  async author(@Root() post: Post, @Ctx() ctx: any): Promise<User> {
    ctx.getPostAuthorDataLoader = ctx.getPostAuthorDataLoader || createGetPostAuthorDataLoader(ctx.photon);
    return ctx.getPostAuthorDataLoader({}).load(post.uuid);
  }
}
