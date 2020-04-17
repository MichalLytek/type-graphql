import * as TypeGraphQL from "type-graphql";
import { MovieCreateWithoutDirectorInput } from "../inputs/MovieCreateWithoutDirectorInput";
import { MovieWhereUniqueInput } from "../inputs/MovieWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true,
  description: undefined,
})
export class MovieCreateManyWithoutDirectorInput {
  @TypeGraphQL.Field(_type => [MovieCreateWithoutDirectorInput], {
    nullable: true,
    description: undefined
  })
  create?: MovieCreateWithoutDirectorInput[] | null;

  @TypeGraphQL.Field(_type => [MovieWhereUniqueInput], {
    nullable: true,
    description: undefined
  })
  connect?: MovieWhereUniqueInput[] | null;
}
