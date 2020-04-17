import * as TypeGraphQL from "type-graphql";
import { AggregateMovieCountArgs } from "./args/AggregateMovieCountArgs";

@TypeGraphQL.ObjectType({
  isAbstract: true,
  description: undefined,
})
export class AggregateMovie {
  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false,
    description: undefined
  })
  count(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: AggregateMovieCountArgs) {
    return ctx.prisma.movie.count(args);
  }
}
