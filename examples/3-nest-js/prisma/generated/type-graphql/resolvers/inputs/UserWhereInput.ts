import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { NullableStringFilter } from "../inputs/NullableStringFilter";
import { PostFilter } from "../inputs/PostFilter";
import { StringFilter } from "../inputs/StringFilter";

@TypeGraphQL.InputType({
  isAbstract: true,
  description: undefined,
})
export class UserWhereInput {
  @TypeGraphQL.Field(_type => StringFilter, {
    nullable: true,
    description: undefined
  })
  id?: StringFilter | null | undefined;

  @TypeGraphQL.Field(_type => StringFilter, {
    nullable: true,
    description: undefined
  })
  email?: StringFilter | null | undefined;

  @TypeGraphQL.Field(_type => NullableStringFilter, {
    nullable: true,
    description: undefined
  })
  name?: NullableStringFilter | null | undefined;

  @TypeGraphQL.Field(_type => PostFilter, {
    nullable: true,
    description: undefined
  })
  posts?: PostFilter | null | undefined;

  @TypeGraphQL.Field(_type => [UserWhereInput], {
    nullable: true,
    description: undefined
  })
  AND?: UserWhereInput[] | null | undefined;

  @TypeGraphQL.Field(_type => [UserWhereInput], {
    nullable: true,
    description: undefined
  })
  OR?: UserWhereInput[] | null | undefined;

  @TypeGraphQL.Field(_type => [UserWhereInput], {
    nullable: true,
    description: undefined
  })
  NOT?: UserWhereInput[] | null | undefined;
}
