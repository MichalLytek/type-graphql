import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { JsonValue, InputJsonValue } from "../../../client";
import { BoolFilter } from "../inputs/BoolFilter";
import { ClientWhereInput } from "../inputs/ClientWhereInput";
import { DateTimeFilter } from "../inputs/DateTimeFilter";
import { EnumPostKindNullableFilter } from "../inputs/EnumPostKindNullableFilter";
import { IntFilter } from "../inputs/IntFilter";
import { IntNullableFilter } from "../inputs/IntNullableFilter";
import { JsonFilter } from "../inputs/JsonFilter";
import { StringFilter } from "../inputs/StringFilter";
import { StringNullableFilter } from "../inputs/StringNullableFilter";

@TypeGraphQL.InputType({
  isAbstract: true,
  description: undefined,
})
export class PostWhereInput {
  @TypeGraphQL.Field(_type => [PostWhereInput], {
    nullable: true,
    description: undefined
  })
  AND?: PostWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [PostWhereInput], {
    nullable: true,
    description: undefined
  })
  OR?: PostWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [PostWhereInput], {
    nullable: true,
    description: undefined
  })
  NOT?: PostWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => StringFilter, {
    nullable: true,
    description: undefined
  })
  uuid?: StringFilter | undefined;

  @TypeGraphQL.Field(_type => DateTimeFilter, {
    nullable: true,
    description: undefined
  })
  createdAt?: DateTimeFilter | undefined;

  @TypeGraphQL.Field(_type => DateTimeFilter, {
    nullable: true,
    description: undefined
  })
  updatedAt?: DateTimeFilter | undefined;

  @TypeGraphQL.Field(_type => BoolFilter, {
    nullable: true,
    description: undefined
  })
  published?: BoolFilter | undefined;

  @TypeGraphQL.Field(_type => StringFilter, {
    nullable: true,
    description: undefined
  })
  title?: StringFilter | undefined;

  @TypeGraphQL.Field(_type => StringFilter, {
    nullable: true,
    description: undefined
  })
  subtitle?: StringFilter | undefined;

  @TypeGraphQL.Field(_type => StringNullableFilter, {
    nullable: true,
    description: undefined
  })
  content?: StringNullableFilter | undefined;

  @TypeGraphQL.Field(_type => ClientWhereInput, {
    nullable: true,
    description: undefined
  })
  author?: ClientWhereInput | undefined;

  @TypeGraphQL.Field(_type => IntFilter, {
    nullable: true,
    description: undefined
  })
  authorId?: IntFilter | undefined;

  @TypeGraphQL.Field(_type => ClientWhereInput, {
    nullable: true,
    description: undefined
  })
  editor?: ClientWhereInput | undefined;

  @TypeGraphQL.Field(_type => IntNullableFilter, {
    nullable: true,
    description: undefined
  })
  editorId?: IntNullableFilter | undefined;

  @TypeGraphQL.Field(_type => EnumPostKindNullableFilter, {
    nullable: true,
    description: undefined
  })
  kind?: EnumPostKindNullableFilter | undefined;

  @TypeGraphQL.Field(_type => JsonFilter, {
    nullable: true,
    description: undefined
  })
  metadata?: JsonFilter | undefined;
}
