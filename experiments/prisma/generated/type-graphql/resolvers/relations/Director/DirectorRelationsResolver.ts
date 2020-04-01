import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { Director } from "../../../models/Director";
import { Movie } from "../../../models/Movie";
import { DirectorMoviesArgs } from "./args/DirectorMoviesArgs";

@Resolver(_of => Director)
export class DirectorRelationsResolver {
  @FieldResolver(_type => [Movie], {
    nullable: true,
    description: undefined,
  })
  async movies(@Root() director: Director, @Ctx() ctx: any, @Args() args: DirectorMoviesArgs): Promise<Movie[] | null> {
    return ctx.prisma.director.findOne({
      where: {
        firstName_lastName: {
          firstName: director.firstName,
          lastName: director.lastName,
        },
      },
    }).movies(args);
  }
}
