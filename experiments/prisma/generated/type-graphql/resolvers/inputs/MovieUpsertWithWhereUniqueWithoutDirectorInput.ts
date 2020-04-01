import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { MovieCreateWithoutDirectorInput } from "../inputs/MovieCreateWithoutDirectorInput";
import { MovieUpdateWithoutDirectorDataInput } from "../inputs/MovieUpdateWithoutDirectorDataInput";
import { MovieWhereUniqueInput } from "../inputs/MovieWhereUniqueInput";

@InputType({
  isAbstract: true,
  description: undefined,
})
export class MovieUpsertWithWhereUniqueWithoutDirectorInput {
  @Field(_type => MovieWhereUniqueInput, {
    nullable: false,
    description: undefined
  })
  where!: MovieWhereUniqueInput;

  @Field(_type => MovieUpdateWithoutDirectorDataInput, {
    nullable: false,
    description: undefined
  })
  update!: MovieUpdateWithoutDirectorDataInput;

  @Field(_type => MovieCreateWithoutDirectorInput, {
    nullable: false,
    description: undefined
  })
  create!: MovieCreateWithoutDirectorInput;
}
