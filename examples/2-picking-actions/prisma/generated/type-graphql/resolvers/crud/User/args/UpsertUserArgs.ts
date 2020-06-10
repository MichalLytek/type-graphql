import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { UserCreateInput } from "../../../inputs/UserCreateInput";
import { UserUpdateInput } from "../../../inputs/UserUpdateInput";
import { UserWhereUniqueInput } from "../../../inputs/UserWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpsertUserArgs {
  @TypeGraphQL.Field(_type => UserWhereUniqueInput, { nullable: false })
  where!: UserWhereUniqueInput;

  @TypeGraphQL.Field(_type => UserCreateInput, { nullable: false })
  create!: UserCreateInput;

  @TypeGraphQL.Field(_type => UserUpdateInput, { nullable: false })
  update!: UserUpdateInput;
}
