import { registerEnumType, ObjectType, Field, Int, Float, ID, Resolver, FieldResolver, Root, Ctx, InputType, Query, Mutation, Arg, ArgsType, Args } from "type-graphql";
import { PostCreateManyWithoutPostsInput } from "../inputs/PostCreateManyWithoutPostsInput";
import { Role } from "../../enums/Role";

@InputType({
  isAbstract: true,
  description: undefined,
})
export class UserCreateInput {
  @Field(_type => String, {
    nullable: false,
    description: undefined
  })
  email!: string;

  @Field(_type => String, {
    nullable: true,
    description: undefined
  })
  name?: string | null;

  @Field(_type => Int, {
    nullable: false,
    description: undefined
  })
  age!: number;

  @Field(_type => Float, {
    nullable: false,
    description: undefined
  })
  balance!: number;

  @Field(_type => Float, {
    nullable: false,
    description: undefined
  })
  amount!: number;

  @Field(_type => Role, {
    nullable: false,
    description: undefined
  })
  role!: keyof typeof Role;

  @Field(_type => PostCreateManyWithoutPostsInput, {
    nullable: true,
    description: undefined
  })
  posts?: PostCreateManyWithoutPostsInput | null;
}
