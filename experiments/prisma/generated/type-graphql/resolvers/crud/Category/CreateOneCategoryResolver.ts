import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { CreateOneCategoryArgs } from "./args/CreateOneCategoryArgs";
import { Category } from "../../../models/Category";

@Resolver(_of => Category)
export class CreateOneCategoryResolver {
  @Mutation(_returns => Category, {
    nullable: false,
    description: undefined
  })
  async createOneCategory(@Ctx() ctx: any, @Args() args: CreateOneCategoryArgs): Promise<Category> {
    return ctx.prisma.category.create(args);
  }
}
