import * as TypeGraphQL from "type-graphql";
import { UpdateOneCategoryArgs } from "./args/UpdateOneCategoryArgs";
import { Category } from "../../../models/Category";

@TypeGraphQL.Resolver(_of => Category)
export class UpdateOneCategoryResolver {
  @TypeGraphQL.Mutation(_returns => Category, {
    nullable: true,
    description: undefined
  })
  async updateOneCategory(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: UpdateOneCategoryArgs): Promise<Category | null> {
    return ctx.prisma.category.update(args);
  }
}
