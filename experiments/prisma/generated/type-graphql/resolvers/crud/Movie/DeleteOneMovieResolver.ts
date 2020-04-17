import * as TypeGraphQL from "type-graphql";
import { DeleteOneMovieArgs } from "./args/DeleteOneMovieArgs";
import { Movie } from "../../../models/Movie";

@TypeGraphQL.Resolver(_of => Movie)
export class DeleteOneMovieResolver {
  @TypeGraphQL.Mutation(_returns => Movie, {
    nullable: true,
    description: undefined
  })
  async deleteOneMovie(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: DeleteOneMovieArgs): Promise<Movie | null> {
    return ctx.prisma.movie.delete(args);
  }
}
