import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import DataLoader from "dataloader";
import { Post } from "../../../models/Post";
import { User } from "../../../models/User";
import { UserPostsArgs } from "./args/UserPostsArgs";

function createGetUserPostsDataLoader(prisma: any) {
  const argsToDataLoaderMap = new Map<string, DataLoader<number, Post[] | null>>();
  return function getUserPostsDataLoader(args: any) {
    const argsJSON = JSON.stringify(args);
    let userPostsDataLoader = argsToDataLoaderMap.get(argsJSON);
    if (!userPostsDataLoader) {
      userPostsDataLoader = new DataLoader<number, Post[] | null>(async keys => {
        const fetchedData: any[] = await prisma.user.findMany({
          where: { id: { in: keys } },
          select: {
            id: true,
            posts: args,
          },
        });
        return keys
          .map(key => fetchedData.find(data => data.id === key)!)
          .map(data => data.posts);
      });
      argsToDataLoaderMap.set(argsJSON, userPostsDataLoader);
    }
    return userPostsDataLoader;
  }
}

@Resolver(_of => User)
export class UserRelationsResolver {
  @FieldResolver(_type => [Post], {
    nullable: true,
    description: undefined,
  })
  async posts(@Root() user: User, @Ctx() ctx: any, @Args() args: UserPostsArgs): Promise<Post[] | null> {
    ctx.getUserPostsDataLoader = ctx.getUserPostsDataLoader || createGetUserPostsDataLoader(ctx.prisma);
    return ctx.getUserPostsDataLoader(args).load(user.id);
  }
}
