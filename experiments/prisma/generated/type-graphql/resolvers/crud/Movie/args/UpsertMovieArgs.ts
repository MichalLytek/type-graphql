import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { MovieCreateInput } from "../../../inputs/MovieCreateInput";
import { MovieUpdateInput } from "../../../inputs/MovieUpdateInput";
import { MovieWhereUniqueInput } from "../../../inputs/MovieWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpsertMovieArgs {
  @TypeGraphQL.Field(_type => MovieWhereUniqueInput, { nullable: false })
  where!: MovieWhereUniqueInput;

  @TypeGraphQL.Field(_type => MovieCreateInput, { nullable: false })
  create!: MovieCreateInput;

  @TypeGraphQL.Field(_type => MovieUpdateInput, { nullable: false })
  update!: MovieUpdateInput;
}
