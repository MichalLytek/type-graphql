import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { FindManyMovieArgs } from "./args/FindManyMovieArgs";
import { Movie } from "../../../models/Movie";

@Resolver(_of => Movie)
export class FindManyMovieResolver {
  @Query(_returns => [Movie], {
    nullable: false,
    description: undefined
  })
  async movies(@Ctx() ctx: any, @Args() args: FindManyMovieArgs): Promise<Movie[]> {
    return ctx.prisma.movie.findMany(args);
  }
}
