import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { FindOnePostArgs } from "./args/FindOnePostArgs";
import { Post } from "../../../models/Post";

@Resolver(_of => Post)
export class FindOnePostResolver {
  @Query(_returns => Post, {
    nullable: true,
    description: undefined
  })
  async findOnePost(@Ctx() ctx: any, @Args() args: FindOnePostArgs): Promise<Post | null> {
    return ctx.prisma.post.findOne(args);
  }
}
