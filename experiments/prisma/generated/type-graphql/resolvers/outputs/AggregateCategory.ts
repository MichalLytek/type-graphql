import * as TypeGraphQL from "type-graphql";
import { AggregateCategoryCountArgs } from "./args/AggregateCategoryCountArgs";

@TypeGraphQL.ObjectType({
  isAbstract: true,
  description: undefined,
})
export class AggregateCategory {
  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false,
    description: undefined
  })
  count(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: AggregateCategoryCountArgs) {
    return ctx.prisma.category.count(args);
  }
}
