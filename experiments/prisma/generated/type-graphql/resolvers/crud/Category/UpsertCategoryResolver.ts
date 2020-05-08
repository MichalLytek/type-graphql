import * as TypeGraphQL from "type-graphql";
import { UpsertCategoryArgs } from "./args/UpsertCategoryArgs";
import { Category } from "../../../models/Category";

@TypeGraphQL.Resolver(_of => Category)
export class UpsertCategoryResolver {
  @TypeGraphQL.Mutation(_returns => Category, {
    nullable: false,
    description: undefined
  })
  async upsertCategory(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: UpsertCategoryArgs): Promise<Category> {
    return ctx.prisma.category.upsert(args);
  }
}
