import * as TypeGraphQL from "type-graphql";
import { MovieScalarWhereInput } from "../inputs/MovieScalarWhereInput";
import { MovieUpdateManyDataInput } from "../inputs/MovieUpdateManyDataInput";

@TypeGraphQL.InputType({
  isAbstract: true,
  description: undefined,
})
export class MovieUpdateManyWithWhereNestedInput {
  @TypeGraphQL.Field(_type => MovieScalarWhereInput, {
    nullable: false,
    description: undefined
  })
  where!: MovieScalarWhereInput;

  @TypeGraphQL.Field(_type => MovieUpdateManyDataInput, {
    nullable: false,
    description: undefined
  })
  data!: MovieUpdateManyDataInput;
}
