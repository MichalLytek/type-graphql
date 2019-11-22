import { registerEnumType, ObjectType, Field, Int, Float, ID, Resolver, FieldResolver, Root, Ctx, InputType, Query, Mutation, Arg, ArgsType, Args } from "type-graphql";
import { PostCreateManyWithoutPostsInput } from "../inputs/PostCreateManyWithoutPostsInput";

@InputType({
  isAbstract: true,
  description: undefined,
})
export class UserCreateInput {
  @Field(_type => ID, {
    nullable: true,
    description: undefined
  })
  id?: string | null;

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

  @Field(_type => PostCreateManyWithoutPostsInput, {
    nullable: true,
    description: undefined
  })
  posts?: PostCreateManyWithoutPostsInput | null;
}
