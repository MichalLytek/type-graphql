import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { JsonValue, InputJsonValue } from "../../../client";
import { CreatorWhereInput } from "../inputs/CreatorWhereInput";

@TypeGraphQL.InputType({
  isAbstract: true,
  description: undefined,
})
export class CreatorListRelationFilter {
  @TypeGraphQL.Field(_type => CreatorWhereInput, {
    nullable: true,
    description: undefined
  })
  every?: CreatorWhereInput | undefined;

  @TypeGraphQL.Field(_type => CreatorWhereInput, {
    nullable: true,
    description: undefined
  })
  some?: CreatorWhereInput | undefined;

  @TypeGraphQL.Field(_type => CreatorWhereInput, {
    nullable: true,
    description: undefined
  })
  none?: CreatorWhereInput | undefined;
}
