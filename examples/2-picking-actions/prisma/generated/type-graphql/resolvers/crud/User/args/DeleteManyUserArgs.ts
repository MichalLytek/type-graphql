import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { UserWhereInput } from "../../../inputs/UserWhereInput";

@TypeGraphQL.ArgsType()
export class DeleteManyUserArgs {
  @TypeGraphQL.Field(_type => UserWhereInput, { nullable: true })
  where?: UserWhereInput | undefined;
}
