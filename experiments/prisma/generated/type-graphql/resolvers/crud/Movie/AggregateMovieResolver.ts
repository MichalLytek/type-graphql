import * as TypeGraphQL from "type-graphql";
import { Movie } from "../../../models/Movie";
import { AggregateMovie } from "../../outputs/AggregateMovie";

@TypeGraphQL.Resolver(_of => Movie)
export class AggregateMovieResolver {
  @TypeGraphQL.Query(_returns => AggregateMovie, {
    nullable: false,
    description: undefined
  })
  async aggregateMovie(): Promise<AggregateMovie> {
    return new AggregateMovie();
  }
}
