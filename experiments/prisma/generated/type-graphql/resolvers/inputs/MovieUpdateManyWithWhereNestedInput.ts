import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { MovieScalarWhereInput } from "../inputs/MovieScalarWhereInput";
import { MovieUpdateManyDataInput } from "../inputs/MovieUpdateManyDataInput";

@InputType({
  isAbstract: true,
  description: undefined,
})
export class MovieUpdateManyWithWhereNestedInput {
  @Field(_type => MovieScalarWhereInput, {
    nullable: false,
    description: undefined
  })
  where!: MovieScalarWhereInput;

  @Field(_type => MovieUpdateManyDataInput, {
    nullable: false,
    description: undefined
  })
  data!: MovieUpdateManyDataInput;
}
