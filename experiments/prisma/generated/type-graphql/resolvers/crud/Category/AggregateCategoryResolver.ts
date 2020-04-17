import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { Category } from "../../../models/Category";
import { AggregateCategory } from "../../outputs/AggregateCategory";

@Resolver(_of => Category)
export class AggregateCategoryResolver {
  @Query(_returns => AggregateCategory, {
    nullable: false,
    description: undefined
  })
  async aggregateCategory(): Promise<AggregateCategory> {
    return new AggregateCategory();
  }
}
