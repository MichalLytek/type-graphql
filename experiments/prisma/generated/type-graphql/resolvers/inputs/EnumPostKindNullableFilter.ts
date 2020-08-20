import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { JsonValue, InputJsonValue } from "../../../client";
import { NestedEnumPostKindNullableFilter } from "../inputs/NestedEnumPostKindNullableFilter";
import { PostKind } from "../../enums/PostKind";

@TypeGraphQL.InputType({
  isAbstract: true,
  description: undefined,
})
export class EnumPostKindNullableFilter {
  @TypeGraphQL.Field(_type => PostKind, {
    nullable: true,
    description: undefined
  })
  equals?: keyof typeof PostKind | undefined;

  @TypeGraphQL.Field(_type => [PostKind], {
    nullable: true,
    description: undefined
  })
  in?: Array<keyof typeof PostKind> | undefined;

  @TypeGraphQL.Field(_type => [PostKind], {
    nullable: true,
    description: undefined
  })
  notIn?: Array<keyof typeof PostKind> | undefined;

  @TypeGraphQL.Field(_type => NestedEnumPostKindNullableFilter, {
    nullable: true,
    description: undefined
  })
  not?: NestedEnumPostKindNullableFilter | undefined;
}
