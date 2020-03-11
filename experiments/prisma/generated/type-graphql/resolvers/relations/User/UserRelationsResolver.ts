import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import DataLoader from "dataloader";
import { Post } from "../../../models/Post";
import { User } from "../../../models/User";
import { UserPostsArgs } from "./args/UserPostsArgs";

function createGetUserPostsDataLoader(prisma: any) {
  const argsToDataLoaderMap = new Map<string, DataLoader<object, Post[] | null>>();
  return function getUserPostsDataLoader(args: any) {
    const argsJSON = JSON.stringify(args);
    let userPostsDataLoader = argsToDataLoaderMap.get(argsJSON);
    if (!userPostsDataLoader) {
      userPostsDataLoader = new DataLoader<object, Post[] | null>(async uniqueFieldsValues => {
        const fetchedData: any[] = await prisma.user.findMany({
          where: {
            OR: uniqueFieldsValues.map((value: any) => ({
              id: value.id,
            })),
          },
          select: {
            posts: args,
            id: true,
          },
        });
        return uniqueFieldsValues
          .map((uniqueValue: any) => fetchedData.find(data =>
            data.id === uniqueValue.id
          )!)
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
    return ctx.getUserPostsDataLoader(args).load({
      id: user.id,
    });
  }
}
