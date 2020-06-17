import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { ClientWhereInput } from "../../../inputs/ClientWhereInput";

@TypeGraphQL.ArgsType()
export class DeleteManyClientArgs {
  @TypeGraphQL.Field(_type => ClientWhereInput, { nullable: true })
  where?: ClientWhereInput | undefined;
}
