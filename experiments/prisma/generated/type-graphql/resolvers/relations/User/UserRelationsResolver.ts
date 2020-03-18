import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { Post } from "../../../models/Post";
import { User } from "../../../models/User";
import { UserPostsArgs } from "./args/UserPostsArgs";

@Resolver(_of => User)
export class UserRelationsResolver {
  @FieldResolver(_type => [Post], {
    nullable: true,
    description: undefined,
  })
  async posts(@Root() user: User, @Ctx() ctx: any, @Args() args: UserPostsArgs): Promise<Post[] | null> {
    return ctx.prisma.user.findOne({
      where: {
        id: user.id,
      },
    }).posts(args);
  }
}
