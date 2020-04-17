import * as TypeGraphQL from "type-graphql";
import { UserCreateInput } from "../../../inputs/UserCreateInput";

@TypeGraphQL.ArgsType()
export class CreateOneUserArgs {
  @TypeGraphQL.Field(_type => UserCreateInput, { nullable: false })
  data!: UserCreateInput;
}
