import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { UserWhereUniqueInput } from "../../../inputs/UserWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class DeleteUserArgs {
  @TypeGraphQL.Field(_type => UserWhereUniqueInput, { nullable: false })
  where!: UserWhereUniqueInput;
}
