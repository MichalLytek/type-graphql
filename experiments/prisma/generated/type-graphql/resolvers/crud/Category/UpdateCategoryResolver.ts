import * as TypeGraphQL from "type-graphql";
import { UpdateCategoryArgs } from "./args/UpdateCategoryArgs";
import { Category } from "../../../models/Category";

@TypeGraphQL.Resolver(_of => Category)
export class UpdateCategoryResolver {
  @TypeGraphQL.Mutation(_returns => Category, {
    nullable: true,
    description: undefined
  })
  async updateCategory(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: UpdateCategoryArgs): Promise<Category | null> {
    return ctx.prisma.category.update(args);
  }
}
