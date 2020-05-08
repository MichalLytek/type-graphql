import * as TypeGraphQL from "type-graphql";
import { ClientWhereInput } from "../../../inputs/ClientWhereInput";

@TypeGraphQL.ArgsType()
export class DeleteManyClientArgs {
  @TypeGraphQL.Field(_type => ClientWhereInput, { nullable: true })
  where?: ClientWhereInput | null;
}
