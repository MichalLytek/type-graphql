import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { JsonValue, InputJsonValue } from "../../../client";
import { MovieUpdateWithoutDirectorDataInput } from "../inputs/MovieUpdateWithoutDirectorDataInput";
import { MovieWhereUniqueInput } from "../inputs/MovieWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true,
  description: undefined,
})
export class MovieUpdateWithWhereUniqueWithoutDirectorInput {
  @TypeGraphQL.Field(_type => MovieWhereUniqueInput, {
    nullable: false,
    description: undefined
  })
  where!: MovieWhereUniqueInput;

  @TypeGraphQL.Field(_type => MovieUpdateWithoutDirectorDataInput, {
    nullable: false,
    description: undefined
  })
  data!: MovieUpdateWithoutDirectorDataInput;
}
