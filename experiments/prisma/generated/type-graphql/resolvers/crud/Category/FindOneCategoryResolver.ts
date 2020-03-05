import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { FindOneCategoryArgs } from "./args/FindOneCategoryArgs";
import { Category } from "../../../models/Category";

@Resolver(_of => Category)
export class FindOneCategoryResolver {
  @Query(_returns => Category, {
    nullable: true,
    description: undefined
  })
  async category(@Ctx() ctx: any, @Args() args: FindOneCategoryArgs): Promise<Category | null> {
    return ctx.prisma.category.findOne(args);
  }
}
