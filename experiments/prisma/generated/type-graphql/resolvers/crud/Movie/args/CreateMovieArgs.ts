import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { MovieCreateInput } from "../../../inputs/MovieCreateInput";

@TypeGraphQL.ArgsType()
export class CreateMovieArgs {
  @TypeGraphQL.Field(_type => MovieCreateInput, { nullable: false })
  data!: MovieCreateInput;
}
