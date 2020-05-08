import * as TypeGraphQL from "type-graphql";
import { MovieCreateInput } from "../../../inputs/MovieCreateInput";

@TypeGraphQL.ArgsType()
export class CreateMovieArgs {
  @TypeGraphQL.Field(_type => MovieCreateInput, { nullable: false })
  data!: MovieCreateInput;
}
