import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import DataLoader from "dataloader";
import { Post } from "../../../models/Post";
import { User } from "../../../models/User";

function createGetPostAuthorDataLoader(photon: any) {
  const argsToDataLoaderMap = new Map<string, DataLoader<string, User | null>>();
  return function getPostAuthorDataLoader(args: any) {
    const argsJSON = JSON.stringify(args);
    let postAuthorDataLoader = argsToDataLoaderMap.get(argsJSON);
    if (!postAuthorDataLoader) {
      postAuthorDataLoader = new DataLoader<string, User | null>(async keys => {
        const fetchedData: any[] = await photon.posts.findMany({
          where: { id: { in: keys } },
          select: {
            id: true,
            author: args,
          },
        });
        return keys
          .map(key => fetchedData.find(data => data.id === key)!)
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
    nullable: true,
    description: undefined,
  })
  async author(@Root() post: Post, @Ctx() ctx: any): Promise<User | null> {
    ctx.getPostAuthorDataLoader = ctx.getPostAuthorDataLoader || createGetPostAuthorDataLoader(ctx.photon);
    return ctx.getPostAuthorDataLoader({}).load(post.id);
  }
}
