import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { UserUpdateInput } from "../../../inputs/UserUpdateInput";
import { UserWhereUniqueInput } from "../../../inputs/UserWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpdateUserArgs {
  @TypeGraphQL.Field(_type => UserUpdateInput, { nullable: false })
  data!: UserUpdateInput;

  @TypeGraphQL.Field(_type => UserWhereUniqueInput, { nullable: false })
  where!: UserWhereUniqueInput;
}
