import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { MovieWhereInput } from "../inputs/MovieWhereInput";

@InputType({
  isAbstract: true,
  description: undefined,
})
export class MovieFilter {
  @Field(_type => MovieWhereInput, {
    nullable: true,
    description: undefined
  })
  every?: MovieWhereInput | null;

  @Field(_type => MovieWhereInput, {
    nullable: true,
    description: undefined
  })
  some?: MovieWhereInput | null;

  @Field(_type => MovieWhereInput, {
    nullable: true,
    description: undefined
  })
  none?: MovieWhereInput | null;
}
