import * as TypeGraphQL from "type-graphql";
import { FindOneMovieArgs } from "./args/FindOneMovieArgs";
import { Movie } from "../../../models/Movie";

@TypeGraphQL.Resolver(_of => Movie)
export class FindOneMovieResolver {
  @TypeGraphQL.Query(_returns => Movie, {
    nullable: true,
    description: undefined
  })
  async movie(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: FindOneMovieArgs): Promise<Movie | undefined> {
    return ctx.prisma.movie.findOne(args);
  }
}
