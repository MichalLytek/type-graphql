import * as TypeGraphQL from "type-graphql";
import { ClientCreateInput } from "../../../inputs/ClientCreateInput";
import { ClientUpdateInput } from "../../../inputs/ClientUpdateInput";
import { ClientWhereUniqueInput } from "../../../inputs/ClientWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpsertClientArgs {
  @TypeGraphQL.Field(_type => ClientWhereUniqueInput, { nullable: false })
  where!: ClientWhereUniqueInput;

  @TypeGraphQL.Field(_type => ClientCreateInput, { nullable: false })
  create!: ClientCreateInput;

  @TypeGraphQL.Field(_type => ClientUpdateInput, { nullable: false })
  update!: ClientUpdateInput;
}
