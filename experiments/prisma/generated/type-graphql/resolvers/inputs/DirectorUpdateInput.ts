import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { MovieUpdateManyWithoutDirectorInput } from "../inputs/MovieUpdateManyWithoutDirectorInput";

@InputType({
  isAbstract: true,
  description: undefined,
})
export class DirectorUpdateInput {
  @Field(_type => String, {
    nullable: true,
    description: undefined
  })
  firstName?: string | null;

  @Field(_type => String, {
    nullable: true,
    description: undefined
  })
  lastName?: string | null;

  @Field(_type => MovieUpdateManyWithoutDirectorInput, {
    nullable: true,
    description: undefined
  })
  movies?: MovieUpdateManyWithoutDirectorInput | null;
}
