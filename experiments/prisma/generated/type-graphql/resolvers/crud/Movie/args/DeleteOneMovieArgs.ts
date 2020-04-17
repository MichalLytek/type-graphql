import * as TypeGraphQL from "type-graphql";
import { MovieWhereUniqueInput } from "../../../inputs/MovieWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class DeleteOneMovieArgs {
  @TypeGraphQL.Field(_type => MovieWhereUniqueInput, { nullable: false })
  where!: MovieWhereUniqueInput;
}
