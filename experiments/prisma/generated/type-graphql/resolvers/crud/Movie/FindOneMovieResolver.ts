import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { FindOneMovieArgs } from "./args/FindOneMovieArgs";
import { Movie } from "../../../models/Movie";

@Resolver(_of => Movie)
export class FindOneMovieResolver {
  @Query(_returns => Movie, {
    nullable: true,
    description: undefined
  })
  async movie(@Ctx() ctx: any, @Args() args: FindOneMovieArgs): Promise<Movie | null> {
    return ctx.prisma.movie.findOne(args);
  }
}
