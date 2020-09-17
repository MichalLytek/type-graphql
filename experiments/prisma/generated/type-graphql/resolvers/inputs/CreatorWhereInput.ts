import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { JsonValue, InputJsonValue } from "../../../client";
import { IntFilter } from "../inputs/IntFilter";
import { ProblemListRelationFilter } from "../inputs/ProblemListRelationFilter";
import { StringFilter } from "../inputs/StringFilter";

@TypeGraphQL.InputType({
  isAbstract: true,
  description: undefined,
})
export class CreatorWhereInput {
  @TypeGraphQL.Field(_type => [CreatorWhereInput], {
    nullable: true,
    description: undefined
  })
  AND?: CreatorWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [CreatorWhereInput], {
    nullable: true,
    description: undefined
  })
  OR?: CreatorWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [CreatorWhereInput], {
    nullable: true,
    description: undefined
  })
  NOT?: CreatorWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => IntFilter, {
    nullable: true,
    description: undefined
  })
  id?: IntFilter | undefined;

  @TypeGraphQL.Field(_type => StringFilter, {
    nullable: true,
    description: undefined
  })
  name?: StringFilter | undefined;

  @TypeGraphQL.Field(_type => ProblemListRelationFilter, {
    nullable: true,
    description: undefined
  })
  likes?: ProblemListRelationFilter | undefined;

  @TypeGraphQL.Field(_type => ProblemListRelationFilter, {
    nullable: true,
    description: undefined
  })
  problems?: ProblemListRelationFilter | undefined;
}
