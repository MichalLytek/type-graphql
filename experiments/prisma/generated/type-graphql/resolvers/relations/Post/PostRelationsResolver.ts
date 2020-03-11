import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import DataLoader from "dataloader";
import { Post } from "../../../models/Post";
import { User } from "../../../models/User";

function createGetPostAuthorDataLoader(prisma: any) {
  const argsToDataLoaderMap = new Map<string, DataLoader<object, User>>();
  return function getPostAuthorDataLoader(args: any) {
    const argsJSON = JSON.stringify(args);
    let postAuthorDataLoader = argsToDataLoaderMap.get(argsJSON);
    if (!postAuthorDataLoader) {
      postAuthorDataLoader = new DataLoader<object, User>(async uniqueFieldsValues => {
        const fetchedData: any[] = await prisma.post.findMany({
          where: {
            OR: uniqueFieldsValues.map((value: any) => ({
              uuid: value.uuid,
            })),
          },
          select: {
            author: args,
            uuid: true,
          },
        });
        return uniqueFieldsValues
          .map((uniqueValue: any) => fetchedData.find(data =>
            data.uuid === uniqueValue.uuid
          )!)
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
    ctx.getPostAuthorDataLoader = ctx.getPostAuthorDataLoader || createGetPostAuthorDataLoader(ctx.prisma);
    return ctx.getPostAuthorDataLoader({}).load({
      uuid: post.uuid,
    });
  }
}
