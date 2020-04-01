import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { Movie } from "../models/Movie";

@ObjectType({
  isAbstract: true,
  description: undefined,
})
export class Director {
  @Field(_type => String, {
    nullable: false,
    description: undefined,
  })
  firstName!: string;

  @Field(_type => String, {
    nullable: false,
    description: undefined,
  })
  lastName!: string;

  movies?: Movie[] | null;
}
