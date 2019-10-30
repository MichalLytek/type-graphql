import { registerEnumType, ObjectType, Field, Int, Float, ID, Resolver, FieldResolver, Root, Ctx, InputType, Query, Mutation, Arg, ArgsType, Args } from "type-graphql";
import { UserCreateWithoutPostsInput } from "../inputs/UserCreateWithoutPostsInput";
import { UserUpdateWithoutPostsDataInput } from "../inputs/UserUpdateWithoutPostsDataInput";
import { UserUpsertWithoutPostsInput } from "../inputs/UserUpsertWithoutPostsInput";
import { UserWhereUniqueInput } from "../inputs/UserWhereUniqueInput";

@InputType({
  isAbstract: true,
  description: undefined,
})
export class UserUpdateOneRequiredWithoutPostsInput {
  @Field(_type => UserCreateWithoutPostsInput, {
    nullable: true,
    description: undefined
  })
  create?: UserCreateWithoutPostsInput | null;

  @Field(_type => UserWhereUniqueInput, {
    nullable: true,
    description: undefined
  })
  connect?: UserWhereUniqueInput | null;

  @Field(_type => UserUpdateWithoutPostsDataInput, {
    nullable: true,
    description: undefined
  })
  update?: UserUpdateWithoutPostsDataInput | null;

  @Field(_type => UserUpsertWithoutPostsInput, {
    nullable: true,
    description: undefined
  })
  upsert?: UserUpsertWithoutPostsInput | null;
}
