import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { JsonValue, InputJsonValue } from "../../../client";
import { ClientWhereInput } from "../inputs/ClientWhereInput";

@TypeGraphQL.InputType({
  isAbstract: true,
  description: undefined,
})
export class ClientRelationFilter {
  @TypeGraphQL.Field(_type => ClientWhereInput, {
    nullable: true,
    description: undefined
  })
  is?: ClientWhereInput | undefined;

  @TypeGraphQL.Field(_type => ClientWhereInput, {
    nullable: true,
    description: undefined
  })
  isNot?: ClientWhereInput | undefined;
}
