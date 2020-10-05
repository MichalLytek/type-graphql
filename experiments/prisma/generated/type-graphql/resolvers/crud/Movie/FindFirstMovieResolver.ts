import * as TypeGraphQL from "type-graphql";
import { FindFirstMovieArgs } from "./args/FindFirstMovieArgs";
import { Movie } from "../../../models/Movie";

@TypeGraphQL.Resolver(_of => Movie)
export class FindFirstMovieResolver {
  @TypeGraphQL.Query(_returns => Movie, {
    nullable: true,
    description: undefined
  })
  async findFirstMovie(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: FindFirstMovieArgs): Promise<Movie | null> {
    return ctx.prisma.movie.findFirst(args);
  }
}
