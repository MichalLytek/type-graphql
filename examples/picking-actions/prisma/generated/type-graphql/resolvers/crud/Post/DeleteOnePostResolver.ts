import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { DeleteOnePostArgs } from "./args/DeleteOnePostArgs";
import { Post } from "../../../models/Post";

@Resolver(_of => Post)
export class DeleteOnePostResolver {
  @Mutation(_returns => Post, {
    nullable: true,
    description: undefined
  })
  async deleteOnePost(@Ctx() ctx: any, @Args() args: DeleteOnePostArgs): Promise<Post | null> {
    return ctx.prisma.post.delete(args);
  }
}
