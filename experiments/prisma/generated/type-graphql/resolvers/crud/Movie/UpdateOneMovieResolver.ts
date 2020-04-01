import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { UpdateOneMovieArgs } from "./args/UpdateOneMovieArgs";
import { Movie } from "../../../models/Movie";

@Resolver(_of => Movie)
export class UpdateOneMovieResolver {
  @Mutation(_returns => Movie, {
    nullable: true,
    description: undefined
  })
  async updateOneMovie(@Ctx() ctx: any, @Args() args: UpdateOneMovieArgs): Promise<Movie | null> {
    return ctx.prisma.movie.update(args);
  }
}
