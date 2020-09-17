import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { JsonValue, InputJsonValue } from "../../../client";
import { ProblemWhereInput } from "../inputs/ProblemWhereInput";

@TypeGraphQL.InputType({
  isAbstract: true,
  description: undefined,
})
export class ProblemListRelationFilter {
  @TypeGraphQL.Field(_type => ProblemWhereInput, {
    nullable: true,
    description: undefined
  })
  every?: ProblemWhereInput | undefined;

  @TypeGraphQL.Field(_type => ProblemWhereInput, {
    nullable: true,
    description: undefined
  })
  some?: ProblemWhereInput | undefined;

  @TypeGraphQL.Field(_type => ProblemWhereInput, {
    nullable: true,
    description: undefined
  })
  none?: ProblemWhereInput | undefined;
}
