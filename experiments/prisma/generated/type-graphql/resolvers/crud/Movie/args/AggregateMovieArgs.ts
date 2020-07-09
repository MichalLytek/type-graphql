import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { MovieOrderByInput } from "../../../inputs/MovieOrderByInput";
import { MovieWhereInput } from "../../../inputs/MovieWhereInput";
import { MovieWhereUniqueInput } from "../../../inputs/MovieWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class AggregateMovieArgs {
  @TypeGraphQL.Field(_type => MovieWhereInput, { nullable: true })
  where?: MovieWhereInput | undefined;

  @TypeGraphQL.Field(_type => MovieOrderByInput, { nullable: true })
  orderBy?: MovieOrderByInput | undefined;

  @TypeGraphQL.Field(_type => MovieWhereUniqueInput, { nullable: true })
  cursor?: MovieWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, { nullable: true })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, { nullable: true })
  skip?: number | undefined;
}
