import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { JsonValue, InputJsonValue } from "@prisma/client";
import { NestedDateTimeFilter } from "../inputs/NestedDateTimeFilter";

@TypeGraphQL.InputType({
  isAbstract: true,
  description: undefined,
})
export class DateTimeFilter {
  @TypeGraphQL.Field(_type => Date, {
    nullable: true,
    description: undefined
  })
  equals?: Date | undefined;

  @TypeGraphQL.Field(_type => [Date], {
    nullable: true,
    description: undefined
  })
  in?: Date[] | undefined;

  @TypeGraphQL.Field(_type => [Date], {
    nullable: true,
    description: undefined
  })
  notIn?: Date[] | undefined;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true,
    description: undefined
  })
  lt?: Date | undefined;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true,
    description: undefined
  })
  lte?: Date | undefined;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true,
    description: undefined
  })
  gt?: Date | undefined;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true,
    description: undefined
  })
  gte?: Date | undefined;

  @TypeGraphQL.Field(_type => NestedDateTimeFilter, {
    nullable: true,
    description: undefined
  })
  not?: NestedDateTimeFilter | undefined;
}
