import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { Director } from "../../../models/Director";
import { Movie } from "../../../models/Movie";

@Resolver(_of => Movie)
export class MovieRelationsResolver {
  @FieldResolver(_type => Director, {
    nullable: false,
    description: undefined,
  })
  async director(@Root() movie: Movie, @Ctx() ctx: any): Promise<Director> {
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
