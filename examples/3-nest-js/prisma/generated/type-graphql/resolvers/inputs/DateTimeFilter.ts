import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";

@TypeGraphQL.InputType({
  isAbstract: true,
  description: undefined,
})
export class DateTimeFilter {
  @TypeGraphQL.Field(_type => Date, {
    nullable: true,
    description: undefined
  })
  equals?: Date | null | undefined;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true,
    description: undefined
  })
  not?: Date | null | undefined;

  @TypeGraphQL.Field(_type => [Date], {
    nullable: true,
    description: undefined
  })
  in?: Date[] | null | undefined;

  @TypeGraphQL.Field(_type => [Date], {
    nullable: true,
    description: undefined
  })
  notIn?: Date[] | null | undefined;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true,
    description: undefined
  })
  lt?: Date | null | undefined;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true,
    description: undefined
  })
  lte?: Date | null | undefined;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true,
    description: undefined
  })
  gt?: Date | null | undefined;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true,
    description: undefined
  })
  gte?: Date | null | undefined;
}
