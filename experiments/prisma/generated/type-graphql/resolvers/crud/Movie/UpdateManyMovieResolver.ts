import * as TypeGraphQL from "type-graphql";
import { UpdateManyMovieArgs } from "./args/UpdateManyMovieArgs";
import { Movie } from "../../../models/Movie";
import { BatchPayload } from "../../outputs/BatchPayload";

@TypeGraphQL.Resolver(_of => Movie)
export class UpdateManyMovieResolver {
  @TypeGraphQL.Mutation(_returns => BatchPayload, {
    nullable: false,
    description: undefined
  })
  async updateManyMovie(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: UpdateManyMovieArgs): Promise<BatchPayload> {
    return ctx.prisma.movie.updateMany(args);
  }
}
