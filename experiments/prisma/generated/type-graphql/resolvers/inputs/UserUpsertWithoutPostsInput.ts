import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { UserCreateWithoutPostsInput } from "../inputs/UserCreateWithoutPostsInput";
import { UserUpdateWithoutPostsDataInput } from "../inputs/UserUpdateWithoutPostsDataInput";

@InputType({
  isAbstract: true,
  description: undefined,
})
export class UserUpsertWithoutPostsInput {
  @Field(_type => UserUpdateWithoutPostsDataInput, {
    nullable: false,
    description: undefined
  })
  update!: UserUpdateWithoutPostsDataInput;

  @Field(_type => UserCreateWithoutPostsInput, {
    nullable: false,
    description: undefined
  })
  create!: UserCreateWithoutPostsInput;
}
