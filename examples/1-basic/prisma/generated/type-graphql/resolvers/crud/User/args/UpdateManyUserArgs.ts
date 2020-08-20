import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { UserUpdateManyMutationInput } from "../../../inputs/UserUpdateManyMutationInput";
import { UserWhereInput } from "../../../inputs/UserWhereInput";

@TypeGraphQL.ArgsType()
export class UpdateManyUserArgs {
  @TypeGraphQL.Field(_type => UserUpdateManyMutationInput, { nullable: false })
  data!: UserUpdateManyMutationInput;

  @TypeGraphQL.Field(_type => UserWhereInput, { nullable: true })
  where?: UserWhereInput | undefined;
}
