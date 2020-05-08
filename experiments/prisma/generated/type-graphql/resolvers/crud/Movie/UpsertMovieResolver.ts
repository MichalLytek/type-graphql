import * as TypeGraphQL from "type-graphql";
import { UpsertMovieArgs } from "./args/UpsertMovieArgs";
import { Movie } from "../../../models/Movie";

@TypeGraphQL.Resolver(_of => Movie)
export class UpsertMovieResolver {
  @TypeGraphQL.Mutation(_returns => Movie, {
    nullable: false,
    description: undefined
  })
  async upsertMovie(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: UpsertMovieArgs): Promise<Movie> {
    return ctx.prisma.movie.upsert(args);
  }
}
