import { registerEnumType, ObjectType, Field, Int, Float, ID, Resolver, FieldResolver, Root, Ctx, InputType, Query, Mutation, Arg, ArgsType, Args } from "type-graphql";
import { Post } from "../models/Post";
import { Role } from "../enums/Role";

/**
 * User model comment
 */
@ObjectType({
  isAbstract: true,
  description: "User model comment",
})
export class User {
  /**
   * User model field comment
   */
  @Field(_type => Int, {
    nullable: false,
    description: "User model field comment",
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
