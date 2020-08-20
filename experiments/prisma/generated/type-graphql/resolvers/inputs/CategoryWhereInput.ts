import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { JsonValue, InputJsonValue } from "../../../client";
import { IntFilter } from "../inputs/IntFilter";
import { StringFilter } from "../inputs/StringFilter";

@TypeGraphQL.InputType({
  isAbstract: true,
  description: undefined,
})
export class CategoryWhereInput {
  @TypeGraphQL.Field(_type => [CategoryWhereInput], {
    nullable: true,
    description: undefined
  })
  AND?: CategoryWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [CategoryWhereInput], {
    nullable: true,
    description: undefined
  })
  OR?: CategoryWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [CategoryWhereInput], {
    nullable: true,
    description: undefined
  })
  NOT?: CategoryWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => StringFilter, {
    nullable: true,
    description: undefined
  })
  name?: StringFilter | undefined;

  @TypeGraphQL.Field(_type => StringFilter, {
    nullable: true,
    description: undefined
  })
  slug?: StringFilter | undefined;

  @TypeGraphQL.Field(_type => IntFilter, {
    nullable: true,
    description: undefined
  })
  number?: IntFilter | undefined;
}
