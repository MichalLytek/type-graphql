import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { UpsertOneCategoryArgs } from "./args/UpsertOneCategoryArgs";
import { Category } from "../../../models/Category";

@Resolver(_of => Category)
export class UpsertOneCategoryResolver {
  @Mutation(_returns => Category, {
    nullable: false,
    description: undefined
  })
  async upsertOneCategory(@Ctx() ctx: any, @Args() args: UpsertOneCategoryArgs): Promise<Category> {
    return ctx.prisma.category.upsert(args);
  }
}
