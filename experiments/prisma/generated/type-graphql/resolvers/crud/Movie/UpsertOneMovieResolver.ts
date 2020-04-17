import * as TypeGraphQL from "type-graphql";
import { UpsertOneMovieArgs } from "./args/UpsertOneMovieArgs";
import { Movie } from "../../../models/Movie";

@TypeGraphQL.Resolver(_of => Movie)
export class UpsertOneMovieResolver {
  @TypeGraphQL.Mutation(_returns => Movie, {
    nullable: false,
    description: undefined
  })
  async upsertOneMovie(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: UpsertOneMovieArgs): Promise<Movie> {
    return ctx.prisma.movie.upsert(args);
  }
}
