import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { DeleteOneCategoryArgs } from "./args/DeleteOneCategoryArgs";
import { Category } from "../../../models/Category";

@Resolver(_of => Category)
export class DeleteOneCategoryResolver {
  @Mutation(_returns => Category, {
    nullable: true,
    description: undefined
  })
  async deleteOneCategory(@Ctx() ctx: any, @Args() args: DeleteOneCategoryArgs): Promise<Category | null> {
    return ctx.prisma.category.delete(args);
  }
}
