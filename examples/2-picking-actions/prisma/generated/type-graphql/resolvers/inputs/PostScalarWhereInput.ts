import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { BooleanFilter } from "../inputs/BooleanFilter";
import { DateTimeFilter } from "../inputs/DateTimeFilter";
import { NullableStringFilter } from "../inputs/NullableStringFilter";
import { StringFilter } from "../inputs/StringFilter";

@TypeGraphQL.InputType({
  isAbstract: true,
  description: undefined,
})
export class PostScalarWhereInput {
  @TypeGraphQL.Field(_type => StringFilter, {
    nullable: true,
    description: undefined
  })
  id?: StringFilter | null | undefined;

  @TypeGraphQL.Field(_type => DateTimeFilter, {
    nullable: true,
    description: undefined
  })
  createdAt?: DateTimeFilter | null | undefined;

  @TypeGraphQL.Field(_type => DateTimeFilter, {
    nullable: true,
    description: undefined
  })
  updatedAt?: DateTimeFilter | null | undefined;

  @TypeGraphQL.Field(_type => BooleanFilter, {
    nullable: true,
    description: undefined
  })
  published?: BooleanFilter | null | undefined;

  @TypeGraphQL.Field(_type => StringFilter, {
    nullable: true,
    description: undefined
  })
  title?: StringFilter | null | undefined;

  @TypeGraphQL.Field(_type => NullableStringFilter, {
    nullable: true,
    description: undefined
  })
  content?: NullableStringFilter | null | undefined;

  @TypeGraphQL.Field(_type => NullableStringFilter, {
    nullable: true,
    description: undefined
  })
  authorId?: NullableStringFilter | null | undefined;

  @TypeGraphQL.Field(_type => [PostScalarWhereInput], {
    nullable: true,
    description: undefined
  })
  AND?: PostScalarWhereInput[] | null | undefined;

  @TypeGraphQL.Field(_type => [PostScalarWhereInput], {
    nullable: true,
    description: undefined
  })
  OR?: PostScalarWhereInput[] | null | undefined;

  @TypeGraphQL.Field(_type => [PostScalarWhereInput], {
    nullable: true,
    description: undefined
  })
  NOT?: PostScalarWhereInput[] | null | undefined;
}
