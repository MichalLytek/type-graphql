import * as TypeGraphQL from "type-graphql";
import { MovieCreateWithoutDirectorInput } from "../inputs/MovieCreateWithoutDirectorInput";
import { MovieScalarWhereInput } from "../inputs/MovieScalarWhereInput";
import { MovieUpdateManyWithWhereNestedInput } from "../inputs/MovieUpdateManyWithWhereNestedInput";
import { MovieUpdateWithWhereUniqueWithoutDirectorInput } from "../inputs/MovieUpdateWithWhereUniqueWithoutDirectorInput";
import { MovieUpsertWithWhereUniqueWithoutDirectorInput } from "../inputs/MovieUpsertWithWhereUniqueWithoutDirectorInput";
import { MovieWhereUniqueInput } from "../inputs/MovieWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true,
  description: undefined,
})
export class MovieUpdateManyWithoutDirectorInput {
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

  @TypeGraphQL.Field(_type => [MovieWhereUniqueInput], {
    nullable: true,
    description: undefined
  })
  set?: MovieWhereUniqueInput[] | null;

  @TypeGraphQL.Field(_type => [MovieWhereUniqueInput], {
    nullable: true,
    description: undefined
  })
  disconnect?: MovieWhereUniqueInput[] | null;

  @TypeGraphQL.Field(_type => [MovieWhereUniqueInput], {
    nullable: true,
    description: undefined
  })
  delete?: MovieWhereUniqueInput[] | null;

  @TypeGraphQL.Field(_type => [MovieUpdateWithWhereUniqueWithoutDirectorInput], {
    nullable: true,
    description: undefined
  })
  update?: MovieUpdateWithWhereUniqueWithoutDirectorInput[] | null;

  @TypeGraphQL.Field(_type => [MovieUpdateManyWithWhereNestedInput], {
    nullable: true,
    description: undefined
  })
  updateMany?: MovieUpdateManyWithWhereNestedInput[] | null;

  @TypeGraphQL.Field(_type => [MovieScalarWhereInput], {
    nullable: true,
    description: undefined
  })
  deleteMany?: MovieScalarWhereInput[] | null;

  @TypeGraphQL.Field(_type => [MovieUpsertWithWhereUniqueWithoutDirectorInput], {
    nullable: true,
    description: undefined
  })
  upsert?: MovieUpsertWithWhereUniqueWithoutDirectorInput[] | null;
}
