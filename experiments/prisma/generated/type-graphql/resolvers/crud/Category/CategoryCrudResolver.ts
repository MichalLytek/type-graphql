import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { AggregateCategoryArgs } from "./args/AggregateCategoryArgs";
import { CreateCategoryArgs } from "./args/CreateCategoryArgs";
import { DeleteCategoryArgs } from "./args/DeleteCategoryArgs";
import { DeleteManyCategoryArgs } from "./args/DeleteManyCategoryArgs";
import { FindManyCategoryArgs } from "./args/FindManyCategoryArgs";
import { FindOneCategoryArgs } from "./args/FindOneCategoryArgs";
import { UpdateCategoryArgs } from "./args/UpdateCategoryArgs";
import { UpdateManyCategoryArgs } from "./args/UpdateManyCategoryArgs";
import { UpsertCategoryArgs } from "./args/UpsertCategoryArgs";
import { Category } from "../../../models/Category";
import { AggregateCategory } from "../../outputs/AggregateCategory";
import { BatchPayload } from "../../outputs/BatchPayload";

@TypeGraphQL.Resolver(_of => Category)
export class CategoryCrudResolver {
  @TypeGraphQL.Query(_returns => Category, {
    nullable: true,
    description: undefined
  })
  async category(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: FindOneCategoryArgs): Promise<Category | undefined> {
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
  async createCategory(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: CreateCategoryArgs): Promise<Category> {
    return ctx.prisma.category.create(args);
  }

  @TypeGraphQL.Mutation(_returns => Category, {
    nullable: true,
    description: undefined
  })
  async deleteCategory(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: DeleteCategoryArgs): Promise<Category | undefined> {
    return ctx.prisma.category.delete(args);
  }

  @TypeGraphQL.Mutation(_returns => Category, {
    nullable: true,
    description: undefined
  })
  async updateCategory(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: UpdateCategoryArgs): Promise<Category | undefined> {
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
  async upsertCategory(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: UpsertCategoryArgs): Promise<Category> {
    return ctx.prisma.category.upsert(args);
  }

  @TypeGraphQL.Query(_returns => AggregateCategory, {
    nullable: false,
    description: undefined
  })
  async aggregateCategory(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: AggregateCategoryArgs): Promise<AggregateCategory> {
    function transformFields(fields: Record<string, any>): Record<string, any> {
      return Object.fromEntries(
        Object.entries(fields).map<[string, any]>(([key, value]) => {
          if (Object.keys(value).length === 0) {
            return [key, true];
          }
          return [key, transformFields(value)];
        })
      );
    }

    return ctx.prisma.category.aggregate({
      ...args,
      ...transformFields(graphqlFields(info as any)),
    });
  }
}
