import * as TypeGraphQL from "type-graphql";
import { UpsertOneCategoryArgs } from "./args/UpsertOneCategoryArgs";
import { Category } from "../../../models/Category";

@TypeGraphQL.Resolver(_of => Category)
export class UpsertOneCategoryResolver {
  @TypeGraphQL.Mutation(_returns => Category, {
    nullable: false,
    description: undefined
  })
  async upsertOneCategory(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: UpsertOneCategoryArgs): Promise<Category> {
    return ctx.prisma.category.upsert(args);
  }
}
