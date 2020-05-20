import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { MovieWhereInput } from "../../../inputs/MovieWhereInput";

@TypeGraphQL.ArgsType()
export class DeleteManyMovieArgs {
  @TypeGraphQL.Field(_type => MovieWhereInput, { nullable: true })
  where?: MovieWhereInput | null | undefined;
}
