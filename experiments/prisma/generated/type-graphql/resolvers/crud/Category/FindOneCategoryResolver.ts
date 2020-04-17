import * as TypeGraphQL from "type-graphql";
import { FindOneCategoryArgs } from "./args/FindOneCategoryArgs";
import { Category } from "../../../models/Category";

@TypeGraphQL.Resolver(_of => Category)
export class FindOneCategoryResolver {
  @TypeGraphQL.Query(_returns => Category, {
    nullable: true,
    description: undefined
  })
  async category(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: FindOneCategoryArgs): Promise<Category | null> {
    return ctx.prisma.category.findOne(args);
  }
}
