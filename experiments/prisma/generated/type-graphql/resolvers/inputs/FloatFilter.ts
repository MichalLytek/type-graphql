import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { JsonValue, InputJsonValue } from "../../../client";
import { NestedFloatFilter } from "../inputs/NestedFloatFilter";

@TypeGraphQL.InputType({
  isAbstract: true,
  description: undefined,
})
export class FloatFilter {
  @TypeGraphQL.Field(_type => TypeGraphQL.Float, {
    nullable: true,
    description: undefined
  })
  equals?: number | undefined;

  @TypeGraphQL.Field(_type => [TypeGraphQL.Float], {
    nullable: true,
    description: undefined
  })
  in?: number[] | undefined;

  @TypeGraphQL.Field(_type => [TypeGraphQL.Float], {
    nullable: true,
    description: undefined
  })
  notIn?: number[] | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Float, {
    nullable: true,
    description: undefined
  })
  lt?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Float, {
    nullable: true,
    description: undefined
  })
  lte?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Float, {
    nullable: true,
    description: undefined
  })
  gt?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Float, {
    nullable: true,
    description: undefined
  })
  gte?: number | undefined;

  @TypeGraphQL.Field(_type => NestedFloatFilter, {
    nullable: true,
    description: undefined
  })
  not?: NestedFloatFilter | undefined;
}
