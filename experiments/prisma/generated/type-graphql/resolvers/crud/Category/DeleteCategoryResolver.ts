import * as TypeGraphQL from "type-graphql";
import { DeleteCategoryArgs } from "./args/DeleteCategoryArgs";
import { Category } from "../../../models/Category";

@TypeGraphQL.Resolver(_of => Category)
export class DeleteCategoryResolver {
  @TypeGraphQL.Mutation(_returns => Category, {
    nullable: true,
    description: undefined
  })
  async deleteCategory(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: DeleteCategoryArgs): Promise<Category | null> {
    return ctx.prisma.category.delete(args);
  }
}
