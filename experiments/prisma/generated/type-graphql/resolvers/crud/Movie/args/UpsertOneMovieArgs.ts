import * as TypeGraphQL from "type-graphql";
import { MovieCreateInput } from "../../../inputs/MovieCreateInput";
import { MovieUpdateInput } from "../../../inputs/MovieUpdateInput";
import { MovieWhereUniqueInput } from "../../../inputs/MovieWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpsertOneMovieArgs {
  @TypeGraphQL.Field(_type => MovieWhereUniqueInput, { nullable: false })
  where!: MovieWhereUniqueInput;

  @TypeGraphQL.Field(_type => MovieCreateInput, { nullable: false })
  create!: MovieCreateInput;

  @TypeGraphQL.Field(_type => MovieUpdateInput, { nullable: false })
  update!: MovieUpdateInput;
}
