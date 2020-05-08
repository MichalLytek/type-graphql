import * as TypeGraphQL from "type-graphql";
import { ClientUpdateInput } from "../../../inputs/ClientUpdateInput";
import { ClientWhereUniqueInput } from "../../../inputs/ClientWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpdateClientArgs {
  @TypeGraphQL.Field(_type => ClientUpdateInput, { nullable: false })
  data!: ClientUpdateInput;

  @TypeGraphQL.Field(_type => ClientWhereUniqueInput, { nullable: false })
  where!: ClientWhereUniqueInput;
}
