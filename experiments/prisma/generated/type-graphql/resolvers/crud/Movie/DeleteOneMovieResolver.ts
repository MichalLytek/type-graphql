import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { DeleteOneMovieArgs } from "./args/DeleteOneMovieArgs";
import { Movie } from "../../../models/Movie";

@Resolver(_of => Movie)
export class DeleteOneMovieResolver {
  @Mutation(_returns => Movie, {
    nullable: true,
    description: undefined
  })
  async deleteOneMovie(@Ctx() ctx: any, @Args() args: DeleteOneMovieArgs): Promise<Movie | null> {
    return ctx.prisma.movie.delete(args);
  }
}
