import * as TypeGraphQL from "type-graphql";
import { MovieUpdateInput } from "../../../inputs/MovieUpdateInput";
import { MovieWhereUniqueInput } from "../../../inputs/MovieWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpdateOneMovieArgs {
  @TypeGraphQL.Field(_type => MovieUpdateInput, { nullable: false })
  data!: MovieUpdateInput;

  @TypeGraphQL.Field(_type => MovieWhereUniqueInput, { nullable: false })
  where!: MovieWhereUniqueInput;
}
