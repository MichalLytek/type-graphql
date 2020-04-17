import * as TypeGraphQL from "type-graphql";
import { MovieUpdateManyWithoutDirectorInput } from "../inputs/MovieUpdateManyWithoutDirectorInput";

@TypeGraphQL.InputType({
  isAbstract: true,
  description: undefined,
})
export class DirectorUpdateInput {
  @TypeGraphQL.Field(_type => String, {
    nullable: true,
    description: undefined
  })
  firstName?: string | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true,
    description: undefined
  })
  lastName?: string | null;

  @TypeGraphQL.Field(_type => MovieUpdateManyWithoutDirectorInput, {
    nullable: true,
    description: undefined
  })
  movies?: MovieUpdateManyWithoutDirectorInput | null;
}
