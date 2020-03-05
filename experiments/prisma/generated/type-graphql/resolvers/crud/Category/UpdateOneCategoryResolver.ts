import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { UpdateOneCategoryArgs } from "./args/UpdateOneCategoryArgs";
import { Category } from "../../../models/Category";

@Resolver(_of => Category)
export class UpdateOneCategoryResolver {
  @Mutation(_returns => Category, {
    nullable: true,
    description: undefined
  })
  async updateOneCategory(@Ctx() ctx: any, @Args() args: UpdateOneCategoryArgs): Promise<Category | null> {
    return ctx.prisma.category.update(args);
  }
}
