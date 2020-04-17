import * as TypeGraphQL from "type-graphql";
import { CreateOneCategoryArgs } from "./args/CreateOneCategoryArgs";
import { Category } from "../../../models/Category";

@TypeGraphQL.Resolver(_of => Category)
export class CreateOneCategoryResolver {
  @TypeGraphQL.Mutation(_returns => Category, {
    nullable: false,
    description: undefined
  })
  async createOneCategory(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: CreateOneCategoryArgs): Promise<Category> {
    return ctx.prisma.category.create(args);
  }
}
