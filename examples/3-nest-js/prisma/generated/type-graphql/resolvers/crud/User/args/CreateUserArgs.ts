import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { UserCreateInput } from "../../../inputs/UserCreateInput";

@TypeGraphQL.ArgsType()
export class CreateUserArgs {
  @TypeGraphQL.Field(_type => UserCreateInput, { nullable: false })
  data!: UserCreateInput;
}
