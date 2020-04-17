import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { AggregateCategoryCountArgs } from "./args/AggregateCategoryCountArgs";

@ObjectType({
  isAbstract: true,
  description: undefined,
})
export class AggregateCategory {
  @Field(_type => Int, {
    nullable: false,
    description: undefined
  })
  count(@Ctx() ctx: any, @Args() args: AggregateCategoryCountArgs) {
    return ctx.prisma.category.count(args);
  }
}
