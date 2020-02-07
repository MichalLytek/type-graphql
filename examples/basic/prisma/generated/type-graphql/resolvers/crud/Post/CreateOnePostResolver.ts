import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { CreateOnePostArgs } from "./args/CreateOnePostArgs";
import { Post } from "../../../models/Post";

@Resolver(_of => Post)
export class CreateOnePostResolver {
  @Mutation(_returns => Post, {
    nullable: false,
    description: undefined
  })
  async createOnePost(@Ctx() ctx: any, @Args() args: CreateOnePostArgs): Promise<Post> {
    return ctx.prisma.post.create(args);
  }
}
