import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { Post } from "../models/Post";
import { Role } from "../enums/Role";

@ObjectType({
  isAbstract: true,
  description: undefined,
})
export class User {
  @Field(_type => Int, {
    nullable: false,
    description: undefined,
  })
  id!: number;

  @Field(_type => String, {
    nullable: false,
    description: undefined,
  })
  email!: string;

  @Field(_type => String, {
    nullable: true,
    description: undefined,
  })
  name?: string | null;

  @Field(_type => Int, {
    nullable: false,
    description: undefined,
  })
  age!: number;

  @Field(_type => Float, {
    nullable: false,
    description: undefined,
  })
  balance!: number;

  @Field(_type => Float, {
    nullable: false,
    description: undefined,
  })
  amount!: number;

  posts?: Post[] | null;

  @Field(_type => Role, {
    nullable: false,
    description: undefined,
  })
  role!: keyof typeof Role;
}
