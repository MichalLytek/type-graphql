import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { CreateOneMovieArgs } from "./args/CreateOneMovieArgs";
import { Movie } from "../../../models/Movie";

@Resolver(_of => Movie)
export class CreateOneMovieResolver {
  @Mutation(_returns => Movie, {
    nullable: false,
    description: undefined
  })
  async createOneMovie(@Ctx() ctx: any, @Args() args: CreateOneMovieArgs): Promise<Movie> {
    return ctx.prisma.movie.create(args);
  }
}
