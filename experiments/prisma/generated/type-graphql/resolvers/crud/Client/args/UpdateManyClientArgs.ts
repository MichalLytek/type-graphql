import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { ClientUpdateManyMutationInput } from "../../../inputs/ClientUpdateManyMutationInput";
import { ClientWhereInput } from "../../../inputs/ClientWhereInput";

@TypeGraphQL.ArgsType()
export class UpdateManyClientArgs {
  @TypeGraphQL.Field(_type => ClientUpdateManyMutationInput, { nullable: false })
  data!: ClientUpdateManyMutationInput;

  @TypeGraphQL.Field(_type => ClientWhereInput, { nullable: true })
  where?: ClientWhereInput | null;
}
