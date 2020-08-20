import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { JsonValue, InputJsonValue } from "../../../client";
import { DirectorWhereInput } from "../inputs/DirectorWhereInput";

@TypeGraphQL.InputType({
  isAbstract: true,
  description: undefined,
})
export class DirectorRelationFilter {
  @TypeGraphQL.Field(_type => DirectorWhereInput, {
    nullable: true,
    description: undefined
  })
  is?: DirectorWhereInput | undefined;

  @TypeGraphQL.Field(_type => DirectorWhereInput, {
    nullable: true,
    description: undefined
  })
  isNot?: DirectorWhereInput | undefined;
}
