import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { JsonValue, InputJsonValue } from "../../../client";
import { CreatorWhereInput } from "../inputs/CreatorWhereInput";

@TypeGraphQL.InputType({
  isAbstract: true,
  description: undefined,
})
export class CreatorRelationFilter {
  @TypeGraphQL.Field(_type => CreatorWhereInput, {
    nullable: true,
    description: undefined
  })
  is?: CreatorWhereInput | undefined;

  @TypeGraphQL.Field(_type => CreatorWhereInput, {
    nullable: true,
    description: undefined
  })
  isNot?: CreatorWhereInput | undefined;
}
