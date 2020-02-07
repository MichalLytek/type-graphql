import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { FindManyPostArgs } from "./args/FindManyPostArgs";
import { Post } from "../../../models/Post";

@Resolver(_of => Post)
export class FindManyPostResolver {
  @Query(_returns => [Post], {
    nullable: false,
    description: undefined
  })
  async findManyPost(@Ctx() ctx: any, @Args() args: FindManyPostArgs): Promise<Post[]> {
    return ctx.prisma.post.findMany(args);
  }
}
