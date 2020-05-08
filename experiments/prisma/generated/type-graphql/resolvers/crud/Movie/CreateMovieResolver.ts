import * as TypeGraphQL from "type-graphql";
import { CreateMovieArgs } from "./args/CreateMovieArgs";
import { Movie } from "../../../models/Movie";

@TypeGraphQL.Resolver(_of => Movie)
export class CreateMovieResolver {
  @TypeGraphQL.Mutation(_returns => Movie, {
    nullable: false,
    description: undefined
  })
  async createMovie(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: CreateMovieArgs): Promise<Movie> {
    return ctx.prisma.movie.create(args);
  }
}
