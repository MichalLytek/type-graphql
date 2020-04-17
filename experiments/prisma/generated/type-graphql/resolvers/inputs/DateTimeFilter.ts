import * as TypeGraphQL from "type-graphql";

@TypeGraphQL.InputType({
  isAbstract: true,
  description: undefined,
})
export class DateTimeFilter {
  @TypeGraphQL.Field(_type => Date, {
    nullable: true,
    description: undefined
  })
  equals?: Date | null;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true,
    description: undefined
  })
  not?: Date | null;

  @TypeGraphQL.Field(_type => [Date], {
    nullable: true,
    description: undefined
  })
  in?: Date[] | null;

  @TypeGraphQL.Field(_type => [Date], {
    nullable: true,
    description: undefined
  })
  notIn?: Date[] | null;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true,
    description: undefined
  })
  lt?: Date | null;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true,
    description: undefined
  })
  lte?: Date | null;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true,
    description: undefined
  })
  gt?: Date | null;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true,
    description: undefined
  })
  gte?: Date | null;
}
