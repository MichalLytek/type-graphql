import * as TypeGraphQL from "type-graphql";
import { DeleteOneCategoryArgs } from "./args/DeleteOneCategoryArgs";
import { Category } from "../../../models/Category";

@TypeGraphQL.Resolver(_of => Category)
export class DeleteOneCategoryResolver {
  @TypeGraphQL.Mutation(_returns => Category, {
    nullable: true,
    description: undefined
  })
  async deleteOneCategory(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: DeleteOneCategoryArgs): Promise<Category | null> {
    return ctx.prisma.category.delete(args);
  }
}
