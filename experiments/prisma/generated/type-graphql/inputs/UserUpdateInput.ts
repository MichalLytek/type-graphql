import { registerEnumType, ObjectType, Field, Int, Float, ID, Resolver, FieldResolver, Root, Ctx, InputType, Query, Mutation, Arg, ArgsType, Args } from "type-graphql";
import { PostUpdateManyWithoutAuthorInput } from "../inputs/PostUpdateManyWithoutAuthorInput";
import { Role } from "../enums/Role";

@InputType({
  isAbstract: true,
  description: undefined,
})
export class UserUpdateInput {
  @Field(_type => Int, {
    nullable: true,
    description: undefined
  })
  id?: number | null;

  @Field(_type => String, {
    nullable: true,
    description: undefined
  })
  email?: string | null;

  @Field(_type => String, {
    nullable: true,
    description: undefined
  })
  name?: string | null;

  @Field(_type => Int, {
    nullable: true,
    description: undefined
  })
  age?: number | null;

  @Field(_type => Float, {
    nullable: true,
    description: undefined
  })
  balance?: number | null;

  @Field(_type => Float, {
    nullable: true,
    description: undefined
  })
  amount?: number | null;

  @Field(_type => Role, {
    nullable: true,
    description: undefined
  })
  role?: keyof typeof Role | null;

  @Field(_type => PostUpdateManyWithoutAuthorInput, {
    nullable: true,
    description: undefined
  })
  posts?: PostUpdateManyWithoutAuthorInput | null;
}
