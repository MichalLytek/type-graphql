import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { FindManyCategoryArgs } from "./args/FindManyCategoryArgs";
import { Category } from "../../../models/Category";

@Resolver(_of => Category)
export class FindManyCategoryResolver {
  @Query(_returns => [Category], {
    nullable: false,
    description: undefined
  })
  async categories(@Ctx() ctx: any, @Args() args: FindManyCategoryArgs): Promise<Category[]> {
    return ctx.prisma.category.findMany(args);
  }
}
