import * as TypeGraphQL from "type-graphql";
import { FindFirstCategoryArgs } from "./args/FindFirstCategoryArgs";
import { Category } from "../../../models/Category";

@TypeGraphQL.Resolver(_of => Category)
export class FindFirstCategoryResolver {
  @TypeGraphQL.Query(_returns => Category, {
    nullable: true,
    description: undefined
  })
  async findFirstCategory(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: FindFirstCategoryArgs): Promise<Category | null> {
    return ctx.prisma.category.findFirst(args);
  }
}
