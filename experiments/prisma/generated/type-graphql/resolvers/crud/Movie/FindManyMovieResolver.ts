import * as TypeGraphQL from "type-graphql";
import { FindManyMovieArgs } from "./args/FindManyMovieArgs";
import { Movie } from "../../../models/Movie";

@TypeGraphQL.Resolver(_of => Movie)
export class FindManyMovieResolver {
  @TypeGraphQL.Query(_returns => [Movie], {
    nullable: false,
    description: undefined
  })
  async movies(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: FindManyMovieArgs): Promise<Movie[]> {
    return ctx.prisma.movie.findMany(args);
  }
}
