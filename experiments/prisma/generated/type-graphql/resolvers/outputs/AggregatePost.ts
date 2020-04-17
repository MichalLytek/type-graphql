import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { AggregatePostCountArgs } from "./args/AggregatePostCountArgs";

@ObjectType({
  isAbstract: true,
  description: undefined,
})
export class AggregatePost {
  @Field(_type => Int, {
    nullable: false,
    description: undefined
  })
  count(@Ctx() ctx: any, @Args() args: AggregatePostCountArgs) {
    return ctx.prisma.post.count(args);
  }
}
