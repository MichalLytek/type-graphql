import * as TypeGraphQL from "type-graphql";
import { Director } from "../../../models/Director";
import { Movie } from "../../../models/Movie";

@TypeGraphQL.Resolver(_of => Movie)
export class MovieRelationsResolver {
  @TypeGraphQL.FieldResolver(_type => Director, {
    nullable: false,
    description: undefined,
  })
  async director(@TypeGraphQL.Root() movie: Movie, @TypeGraphQL.Ctx() ctx: any): Promise<Director> {
    return ctx.prisma.movie.findOne({
      where: {
        directorFirstName_directorLastName_title: {
          directorFirstName: movie.directorFirstName,
          directorLastName: movie.directorLastName,
          title: movie.title,
        },
      },
    }).director({});
  }
}
