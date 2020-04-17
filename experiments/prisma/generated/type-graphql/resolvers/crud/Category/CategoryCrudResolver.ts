import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { CreateOneCategoryArgs } from "./args/CreateOneCategoryArgs";
import { DeleteManyCategoryArgs } from "./args/DeleteManyCategoryArgs";
import { DeleteOneCategoryArgs } from "./args/DeleteOneCategoryArgs";
import { FindManyCategoryArgs } from "./args/FindManyCategoryArgs";
import { FindOneCategoryArgs } from "./args/FindOneCategoryArgs";
import { UpdateManyCategoryArgs } from "./args/UpdateManyCategoryArgs";
import { UpdateOneCategoryArgs } from "./args/UpdateOneCategoryArgs";
import { UpsertOneCategoryArgs } from "./args/UpsertOneCategoryArgs";
import { Category } from "../../../models/Category";
import { AggregateCategory } from "../../outputs/AggregateCategory";
import { BatchPayload } from "../../outputs/BatchPayload";

@Resolver(_of => Category)
export class CategoryCrudResolver {
  @Query(_returns => Category, {
    nullable: true,
    description: undefined
  })
  async category(@Ctx() ctx: any, @Args() args: FindOneCategoryArgs): Promise<Category | null> {
    return ctx.prisma.category.findOne(args);
  }

  @Query(_returns => [Category], {
    nullable: false,
    description: undefined
  })
  async categories(@Ctx() ctx: any, @Args() args: FindManyCategoryArgs): Promise<Category[]> {
    return ctx.prisma.category.findMany(args);
  }

  @Mutation(_returns => Category, {
    nullable: false,
    description: undefined
  })
  async createOneCategory(@Ctx() ctx: any, @Args() args: CreateOneCategoryArgs): Promise<Category> {
    return ctx.prisma.category.create(args);
  }

  @Mutation(_returns => Category, {
    nullable: true,
    description: undefined
  })
  async deleteOneCategory(@Ctx() ctx: any, @Args() args: DeleteOneCategoryArgs): Promise<Category | null> {
    return ctx.prisma.category.delete(args);
  }

  @Mutation(_returns => Category, {
    nullable: true,
    description: undefined
  })
  async updateOneCategory(@Ctx() ctx: any, @Args() args: UpdateOneCategoryArgs): Promise<Category | null> {
    return ctx.prisma.category.update(args);
  }

  @Mutation(_returns => BatchPayload, {
    nullable: false,
    description: undefined
  })
  async deleteManyCategory(@Ctx() ctx: any, @Args() args: DeleteManyCategoryArgs): Promise<BatchPayload> {
    return ctx.prisma.category.deleteMany(args);
  }

  @Mutation(_returns => BatchPayload, {
    nullable: false,
    description: undefined
  })
  async updateManyCategory(@Ctx() ctx: any, @Args() args: UpdateManyCategoryArgs): Promise<BatchPayload> {
    return ctx.prisma.category.updateMany(args);
  }

  @Mutation(_returns => Category, {
    nullable: false,
    description: undefined
  })
  async upsertOneCategory(@Ctx() ctx: any, @Args() args: UpsertOneCategoryArgs): Promise<Category> {
    return ctx.prisma.category.upsert(args);
  }

  @Query(_returns => AggregateCategory, {
    nullable: false,
    description: undefined
  })
  async aggregateCategory(): Promise<AggregateCategory> {
    return new AggregateCategory();
  }
}
