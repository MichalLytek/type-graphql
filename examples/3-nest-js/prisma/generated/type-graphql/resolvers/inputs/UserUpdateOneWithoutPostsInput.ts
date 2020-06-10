import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { UserCreateWithoutPostsInput } from "../inputs/UserCreateWithoutPostsInput";
import { UserUpdateWithoutPostsDataInput } from "../inputs/UserUpdateWithoutPostsDataInput";
import { UserUpsertWithoutPostsInput } from "../inputs/UserUpsertWithoutPostsInput";
import { UserWhereUniqueInput } from "../inputs/UserWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true,
  description: undefined,
})
export class UserUpdateOneWithoutPostsInput {
  @TypeGraphQL.Field(_type => UserCreateWithoutPostsInput, {
    nullable: true,
    description: undefined
  })
  create?: UserCreateWithoutPostsInput | null | undefined;

  @TypeGraphQL.Field(_type => UserWhereUniqueInput, {
    nullable: true,
    description: undefined
  })
  connect?: UserWhereUniqueInput | null | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true,
    description: undefined
  })
  disconnect?: boolean | null | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true,
    description: undefined
  })
  delete?: boolean | null | undefined;

  @TypeGraphQL.Field(_type => UserUpdateWithoutPostsDataInput, {
    nullable: true,
    description: undefined
  })
  update?: UserUpdateWithoutPostsDataInput | null | undefined;

  @TypeGraphQL.Field(_type => UserUpsertWithoutPostsInput, {
    nullable: true,
    description: undefined
  })
  upsert?: UserUpsertWithoutPostsInput | null | undefined;
}
