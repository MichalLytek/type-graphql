import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { Director } from "../models/Director";

@ObjectType({
  isAbstract: true,
  description: undefined,
})
export class Movie {
  @Field(_type => String, {
    nullable: false,
    description: undefined,
  })
  directorFirstName!: string;

  @Field(_type => String, {
    nullable: false,
    description: undefined,
  })
  directorLastName!: string;

  director?: Director;

  @Field(_type => String, {
    nullable: false,
    description: undefined,
  })
  title!: string;
}
