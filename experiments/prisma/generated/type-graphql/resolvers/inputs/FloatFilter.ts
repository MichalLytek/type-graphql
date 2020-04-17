import * as TypeGraphQL from "type-graphql";

@TypeGraphQL.InputType({
  isAbstract: true,
  description: undefined,
})
export class FloatFilter {
  @TypeGraphQL.Field(_type => TypeGraphQL.Float, {
    nullable: true,
    description: undefined
  })
  equals?: number | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Float, {
    nullable: true,
    description: undefined
  })
  not?: number | null;

  @TypeGraphQL.Field(_type => [TypeGraphQL.Float], {
    nullable: true,
    description: undefined
  })
  in?: number[] | null;

  @TypeGraphQL.Field(_type => [TypeGraphQL.Float], {
    nullable: true,
    description: undefined
  })
  notIn?: number[] | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Float, {
    nullable: true,
    description: undefined
  })
  lt?: number | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Float, {
    nullable: true,
    description: undefined
  })
  lte?: number | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Float, {
    nullable: true,
    description: undefined
  })
  gt?: number | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Float, {
    nullable: true,
    description: undefined
  })
  gte?: number | null;
}
