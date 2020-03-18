import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { Post } from "../../../models/Post";
import { User } from "../../../models/User";

@Resolver(_of => Post)
export class PostRelationsResolver {
  @FieldResolver(_type => User, {
    nullable: false,
    description: undefined,
  })
  async author(@Root() post: Post, @Ctx() ctx: any): Promise<User> {
    return ctx.prisma.post.findOne({
      where: {
        uuid: post.uuid,
      },
    }).author({});
  }
}
