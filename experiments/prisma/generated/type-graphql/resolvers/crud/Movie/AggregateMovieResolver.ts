import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { AggregateMovieArgs } from "./args/AggregateMovieArgs";
import { Movie } from "../../../models/Movie";
import { AggregateMovie } from "../../outputs/AggregateMovie";

@TypeGraphQL.Resolver(_of => Movie)
export class AggregateMovieResolver {
  @TypeGraphQL.Query(_returns => AggregateMovie, {
    nullable: false,
    description: undefined
  })
  async aggregateMovie(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: AggregateMovieArgs): Promise<AggregateMovie> {
    function transformFields(fields: Record<string, any>): Record<string, any> {
      return Object.fromEntries(
        Object.entries(fields).map<[string, any]>(([key, value]) => {
          if (Object.keys(value).length === 0) {
            return [key, true];
          }
          return [key, transformFields(value)];
        })
      );
    }

    return ctx.prisma.movie.aggregate({
      ...args,
      ...transformFields(graphqlFields(info as any)),
    });
  }
}
