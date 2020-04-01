import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { UpsertOneMovieArgs } from "./args/UpsertOneMovieArgs";
import { Movie } from "../../../models/Movie";

@Resolver(_of => Movie)
export class UpsertOneMovieResolver {
  @Mutation(_returns => Movie, {
    nullable: false,
    description: undefined
  })
  async upsertOneMovie(@Ctx() ctx: any, @Args() args: UpsertOneMovieArgs): Promise<Movie> {
    return ctx.prisma.movie.upsert(args);
  }
}
