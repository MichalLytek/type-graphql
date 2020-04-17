import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { AggregateDirectorCountArgs } from "./args/AggregateDirectorCountArgs";

@ObjectType({
  isAbstract: true,
  description: undefined,
})
export class AggregateDirector {
  @Field(_type => Int, {
    nullable: false,
    description: undefined
  })
  count(@Ctx() ctx: any, @Args() args: AggregateDirectorCountArgs) {
    return ctx.prisma.director.count(args);
  }
}
