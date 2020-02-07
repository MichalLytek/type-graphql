import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { UpdateOnePostArgs } from "./args/UpdateOnePostArgs";
import { Post } from "../../../models/Post";

@Resolver(_of => Post)
export class UpdateOnePostResolver {
  @Mutation(_returns => Post, {
    nullable: true,
    description: undefined
  })
  async updateOnePost(@Ctx() ctx: any, @Args() args: UpdateOnePostArgs): Promise<Post | null> {
    return ctx.prisma.post.update(args);
  }
}
