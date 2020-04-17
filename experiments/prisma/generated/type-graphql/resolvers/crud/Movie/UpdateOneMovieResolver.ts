import * as TypeGraphQL from "type-graphql";
import { UpdateOneMovieArgs } from "./args/UpdateOneMovieArgs";
import { Movie } from "../../../models/Movie";

@TypeGraphQL.Resolver(_of => Movie)
export class UpdateOneMovieResolver {
  @TypeGraphQL.Mutation(_returns => Movie, {
    nullable: true,
    description: undefined
  })
  async updateOneMovie(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: UpdateOneMovieArgs): Promise<Movie | null> {
    return ctx.prisma.movie.update(args);
  }
}
