import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { AggregateMovieCountArgs } from "./args/AggregateMovieCountArgs";

@ObjectType({
  isAbstract: true,
  description: undefined,
})
export class AggregateMovie {
  @Field(_type => Int, {
    nullable: false,
    description: undefined
  })
  count(@Ctx() ctx: any, @Args() args: AggregateMovieCountArgs) {
    return ctx.prisma.movie.count(args);
  }
}
