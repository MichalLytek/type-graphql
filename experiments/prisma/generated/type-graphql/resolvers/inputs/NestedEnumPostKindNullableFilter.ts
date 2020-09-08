import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { JsonValue, InputJsonValue } from "../../../client";
import { PostKind } from "../../enums/PostKind";

@TypeGraphQL.InputType({
  isAbstract: true,
  description: undefined,
})
export class NestedEnumPostKindNullableFilter {
  @TypeGraphQL.Field(_type => PostKind, {
    nullable: true,
    description: undefined
  })
  equals?: typeof PostKind[keyof typeof PostKind] | undefined;

  @TypeGraphQL.Field(_type => [PostKind], {
    nullable: true,
    description: undefined
  })
  in?: Array<typeof PostKind[keyof typeof PostKind]> | undefined;

  @TypeGraphQL.Field(_type => [PostKind], {
    nullable: true,
    description: undefined
  })
  notIn?: Array<typeof PostKind[keyof typeof PostKind]> | undefined;

  @TypeGraphQL.Field(_type => NestedEnumPostKindNullableFilter, {
    nullable: true,
    description: undefined
  })
  not?: NestedEnumPostKindNullableFilter | undefined;
}
