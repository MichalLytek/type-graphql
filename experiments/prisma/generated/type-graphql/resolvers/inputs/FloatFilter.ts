import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";

@TypeGraphQL.InputType({
  isAbstract: true,
  description: undefined,
})
export class FloatFilter {
  @TypeGraphQL.Field(_type => TypeGraphQL.Float, {
    nullable: true,
    description: undefined
  })
  equals?: number | null | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Float, {
    nullable: true,
    description: undefined
  })
  not?: number | null | undefined;

  @TypeGraphQL.Field(_type => [TypeGraphQL.Float], {
    nullable: true,
    description: undefined
  })
  in?: number[] | null | undefined;

  @TypeGraphQL.Field(_type => [TypeGraphQL.Float], {
    nullable: true,
    description: undefined
  })
  notIn?: number[] | null | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Float, {
    nullable: true,
    description: undefined
  })
  lt?: number | null | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Float, {
    nullable: true,
    description: undefined
  })
  lte?: number | null | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Float, {
    nullable: true,
    description: undefined
  })
  gt?: number | null | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Float, {
    nullable: true,
    description: undefined
  })
  gte?: number | null | undefined;
}
