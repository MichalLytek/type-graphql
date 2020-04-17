import * as TypeGraphQL from "type-graphql";
import { DeleteManyMovieArgs } from "./args/DeleteManyMovieArgs";
import { Movie } from "../../../models/Movie";
import { BatchPayload } from "../../outputs/BatchPayload";

@TypeGraphQL.Resolver(_of => Movie)
export class DeleteManyMovieResolver {
  @TypeGraphQL.Mutation(_returns => BatchPayload, {
    nullable: false,
    description: undefined
  })
  async deleteManyMovie(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: DeleteManyMovieArgs): Promise<BatchPayload> {
    return ctx.prisma.movie.deleteMany(args);
  }
}
