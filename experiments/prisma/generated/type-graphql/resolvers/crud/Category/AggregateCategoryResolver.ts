import * as TypeGraphQL from "type-graphql";
import { Category } from "../../../models/Category";
import { AggregateCategory } from "../../outputs/AggregateCategory";

@TypeGraphQL.Resolver(_of => Category)
export class AggregateCategoryResolver {
  @TypeGraphQL.Query(_returns => AggregateCategory, {
    nullable: false,
    description: undefined
  })
  async aggregateCategory(): Promise<AggregateCategory> {
    return new AggregateCategory();
  }
}
