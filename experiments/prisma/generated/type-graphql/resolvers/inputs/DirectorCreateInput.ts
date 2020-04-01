import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { MovieCreateManyWithoutDirectorInput } from "../inputs/MovieCreateManyWithoutDirectorInput";

@InputType({
  isAbstract: true,
  description: undefined,
})
export class DirectorCreateInput {
  @Field(_type => String, {
    nullable: false,
    description: undefined
  })
  firstName!: string;

  @Field(_type => String, {
    nullable: false,
    description: undefined
  })
  lastName!: string;

  @Field(_type => MovieCreateManyWithoutDirectorInput, {
    nullable: true,
    description: undefined
  })
  movies?: MovieCreateManyWithoutDirectorInput | null;
}
