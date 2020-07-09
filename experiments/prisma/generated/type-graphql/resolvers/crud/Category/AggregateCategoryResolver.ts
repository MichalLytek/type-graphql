import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { AggregateCategoryArgs } from "./args/AggregateCategoryArgs";
import { Category } from "../../../models/Category";
import { AggregateCategory } from "../../outputs/AggregateCategory";

@TypeGraphQL.Resolver(_of => Category)
export class AggregateCategoryResolver {
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
