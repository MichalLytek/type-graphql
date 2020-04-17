import * as TypeGraphQL from "type-graphql";
import { CreateOneMovieArgs } from "./args/CreateOneMovieArgs";
import { Movie } from "../../../models/Movie";

@TypeGraphQL.Resolver(_of => Movie)
export class CreateOneMovieResolver {
  @TypeGraphQL.Mutation(_returns => Movie, {
    nullable: false,
    description: undefined
  })
  async createOneMovie(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: CreateOneMovieArgs): Promise<Movie> {
    return ctx.prisma.movie.create(args);
  }
}
