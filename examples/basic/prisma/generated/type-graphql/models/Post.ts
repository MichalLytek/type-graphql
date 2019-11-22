import { registerEnumType, ObjectType, Field, Int, Float, ID, Resolver, FieldResolver, Root, Ctx, InputType, Query, Mutation, Arg, ArgsType, Args } from "type-graphql";
import { User } from "../models/User";

@ObjectType({
  isAbstract: true,
  description: undefined,
})
export class Post {
  @Field(_type => String, {
    nullable: false,
    description: undefined,
  })
  id!: string;

  @Field(_type => Date, {
    nullable: false,
    description: undefined,
  })
  createdAt!: Date;

  @Field(_type => Date, {
    nullable: false,
    description: undefined,
  })
  updatedAt!: Date;

  @Field(_type => Boolean, {
    nullable: false,
    description: undefined,
  })
  published!: boolean;

  @Field(_type => String, {
    nullable: false,
    description: undefined,
  })
  title!: string;

  @Field(_type => String, {
    nullable: true,
    description: undefined,
  })
  content?: string | null;

  author?: User | null;
}
