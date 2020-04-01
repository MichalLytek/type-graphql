import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { MovieCreateWithoutDirectorInput } from "../inputs/MovieCreateWithoutDirectorInput";
import { MovieScalarWhereInput } from "../inputs/MovieScalarWhereInput";
import { MovieUpdateManyWithWhereNestedInput } from "../inputs/MovieUpdateManyWithWhereNestedInput";
import { MovieUpdateWithWhereUniqueWithoutDirectorInput } from "../inputs/MovieUpdateWithWhereUniqueWithoutDirectorInput";
import { MovieUpsertWithWhereUniqueWithoutDirectorInput } from "../inputs/MovieUpsertWithWhereUniqueWithoutDirectorInput";
import { MovieWhereUniqueInput } from "../inputs/MovieWhereUniqueInput";

@InputType({
  isAbstract: true,
  description: undefined,
})
export class MovieUpdateManyWithoutDirectorInput {
  @Field(_type => [MovieCreateWithoutDirectorInput], {
    nullable: true,
    description: undefined
  })
  create?: MovieCreateWithoutDirectorInput[] | null;

  @Field(_type => [MovieWhereUniqueInput], {
    nullable: true,
    description: undefined
  })
  connect?: MovieWhereUniqueInput[] | null;

  @Field(_type => [MovieWhereUniqueInput], {
    nullable: true,
    description: undefined
  })
  set?: MovieWhereUniqueInput[] | null;

  @Field(_type => [MovieWhereUniqueInput], {
    nullable: true,
    description: undefined
  })
  disconnect?: MovieWhereUniqueInput[] | null;

  @Field(_type => [MovieWhereUniqueInput], {
    nullable: true,
    description: undefined
  })
  delete?: MovieWhereUniqueInput[] | null;

  @Field(_type => [MovieUpdateWithWhereUniqueWithoutDirectorInput], {
    nullable: true,
    description: undefined
  })
  update?: MovieUpdateWithWhereUniqueWithoutDirectorInput[] | null;

  @Field(_type => [MovieUpdateManyWithWhereNestedInput], {
    nullable: true,
    description: undefined
  })
  updateMany?: MovieUpdateManyWithWhereNestedInput[] | null;

  @Field(_type => [MovieScalarWhereInput], {
    nullable: true,
    description: undefined
  })
  deleteMany?: MovieScalarWhereInput[] | null;

  @Field(_type => [MovieUpsertWithWhereUniqueWithoutDirectorInput], {
    nullable: true,
    description: undefined
  })
  upsert?: MovieUpsertWithWhereUniqueWithoutDirectorInput[] | null;
}
