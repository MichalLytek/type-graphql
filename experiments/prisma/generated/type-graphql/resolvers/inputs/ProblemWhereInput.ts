import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { JsonValue, InputJsonValue } from "../../../client";
import { CreatorListRelationFilter } from "../inputs/CreatorListRelationFilter";
import { CreatorWhereInput } from "../inputs/CreatorWhereInput";
import { IntFilter } from "../inputs/IntFilter";
import { IntNullableFilter } from "../inputs/IntNullableFilter";
import { StringFilter } from "../inputs/StringFilter";

@TypeGraphQL.InputType({
  isAbstract: true,
  description: undefined,
})
export class ProblemWhereInput {
  @TypeGraphQL.Field(_type => [ProblemWhereInput], {
    nullable: true,
    description: undefined
  })
  AND?: ProblemWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [ProblemWhereInput], {
    nullable: true,
    description: undefined
  })
  OR?: ProblemWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [ProblemWhereInput], {
    nullable: true,
    description: undefined
  })
  NOT?: ProblemWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => IntFilter, {
    nullable: true,
    description: undefined
  })
  id?: IntFilter | undefined;

  @TypeGraphQL.Field(_type => StringFilter, {
    nullable: true,
    description: undefined
  })
  problemText?: StringFilter | undefined;

  @TypeGraphQL.Field(_type => CreatorListRelationFilter, {
    nullable: true,
    description: undefined
  })
  likedBy?: CreatorListRelationFilter | undefined;

  @TypeGraphQL.Field(_type => CreatorWhereInput, {
    nullable: true,
    description: undefined
  })
  creator?: CreatorWhereInput | undefined;

  @TypeGraphQL.Field(_type => IntNullableFilter, {
    nullable: true,
    description: undefined
  })
  creatorId?: IntNullableFilter | undefined;
}
