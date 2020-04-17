import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { AggregateUserCountArgs } from "./args/AggregateUserCountArgs";

@ObjectType({
  isAbstract: true,
  description: undefined,
})
export class AggregateUser {
  @Field(_type => Int, {
    nullable: false,
    description: undefined
  })
  count(@Ctx() ctx: any, @Args() args: AggregateUserCountArgs) {
    return ctx.prisma.user.count(args);
  }
}
