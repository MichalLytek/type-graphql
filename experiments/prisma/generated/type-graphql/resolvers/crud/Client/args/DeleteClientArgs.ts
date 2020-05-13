import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { ClientWhereUniqueInput } from "../../../inputs/ClientWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class DeleteClientArgs {
  @TypeGraphQL.Field(_type => ClientWhereUniqueInput, { nullable: false })
  where!: ClientWhereUniqueInput;
}
