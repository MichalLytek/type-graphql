import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { ClientCreateInput } from "../../../inputs/ClientCreateInput";

@TypeGraphQL.ArgsType()
export class CreateClientArgs {
  @TypeGraphQL.Field(_type => ClientCreateInput, { nullable: false })
  data!: ClientCreateInput;
}
