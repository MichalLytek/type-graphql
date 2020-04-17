import * as TypeGraphQL from "type-graphql";
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

@TypeGraphQL.Resolver(_of => Category)
export class CategoryCrudResolver {
  @TypeGraphQL.Query(_returns => Category, {
    nullable: true,
    description: undefined
  })
  async category(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: FindOneCategoryArgs): Promise<Category | null> {
    return ctx.prisma.category.findOne(args);
  }

  @TypeGraphQL.Query(_returns => [Category], {
    nullable: false,
    description: undefined
  })
  async categories(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: FindManyCategoryArgs): Promise<Category[]> {
    return ctx.prisma.category.findMany(args);
  }

  @TypeGraphQL.Mutation(_returns => Category, {
    nullable: false,
    description: undefined
  })
  async createOneCategory(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: CreateOneCategoryArgs): Promise<Category> {
    return ctx.prisma.category.create(args);
  }

  @TypeGraphQL.Mutation(_returns => Category, {
    nullable: true,
    description: undefined
  })
  async deleteOneCategory(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: DeleteOneCategoryArgs): Promise<Category | null> {
    return ctx.prisma.category.delete(args);
  }

  @TypeGraphQL.Mutation(_returns => Category, {
    nullable: true,
    description: undefined
  })
  async updateOneCategory(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: UpdateOneCategoryArgs): Promise<Category | null> {
    return ctx.prisma.category.update(args);
  }

  @TypeGraphQL.Mutation(_returns => BatchPayload, {
    nullable: false,
    description: undefined
  })
  async deleteManyCategory(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: DeleteManyCategoryArgs): Promise<BatchPayload> {
    return ctx.prisma.category.deleteMany(args);
  }

  @TypeGraphQL.Mutation(_returns => BatchPayload, {
    nullable: false,
    description: undefined
  })
  async updateManyCategory(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: UpdateManyCategoryArgs): Promise<BatchPayload> {
    return ctx.prisma.category.updateMany(args);
  }

  @TypeGraphQL.Mutation(_returns => Category, {
    nullable: false,
    description: undefined
  })
  async upsertOneCategory(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: UpsertOneCategoryArgs): Promise<Category> {
    return ctx.prisma.category.upsert(args);
  }

  @TypeGraphQL.Query(_returns => AggregateCategory, {
    nullable: false,
    description: undefined
  })
  async aggregateCategory(): Promise<AggregateCategory> {
    return new AggregateCategory();
  }
}
