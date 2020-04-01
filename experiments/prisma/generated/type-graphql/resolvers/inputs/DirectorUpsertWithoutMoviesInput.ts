import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { DirectorCreateWithoutMoviesInput } from "../inputs/DirectorCreateWithoutMoviesInput";
import { DirectorUpdateWithoutMoviesDataInput } from "../inputs/DirectorUpdateWithoutMoviesDataInput";

@InputType({
  isAbstract: true,
  description: undefined,
})
export class DirectorUpsertWithoutMoviesInput {
  @Field(_type => DirectorUpdateWithoutMoviesDataInput, {
    nullable: false,
    description: undefined
  })
  update!: DirectorUpdateWithoutMoviesDataInput;

  @Field(_type => DirectorCreateWithoutMoviesInput, {
    nullable: false,
    description: undefined
  })
  create!: DirectorCreateWithoutMoviesInput;
}
