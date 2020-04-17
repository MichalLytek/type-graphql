import * as TypeGraphQL from "type-graphql";
import { FindManyCategoryArgs } from "./args/FindManyCategoryArgs";
import { Category } from "../../../models/Category";

@TypeGraphQL.Resolver(_of => Category)
export class FindManyCategoryResolver {
  @TypeGraphQL.Query(_returns => [Category], {
    nullable: false,
    description: undefined
  })
  async categories(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: FindManyCategoryArgs): Promise<Category[]> {
    return ctx.prisma.category.findMany(args);
  }
}
