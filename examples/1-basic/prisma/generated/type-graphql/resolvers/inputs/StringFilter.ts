import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";

@TypeGraphQL.InputType({
  isAbstract: true,
  description: undefined,
})
export class StringFilter {
  @TypeGraphQL.Field(_type => String, {
    nullable: true,
    description: undefined
  })
  equals?: string | null | undefined;

  @TypeGraphQL.Field(_type => String, {
    nullable: true,
    description: undefined
  })
  not?: string | null | undefined;

  @TypeGraphQL.Field(_type => [String], {
    nullable: true,
    description: undefined
  })
  in?: string[] | null | undefined;

  @TypeGraphQL.Field(_type => [String], {
    nullable: true,
    description: undefined
  })
  notIn?: string[] | null | undefined;

  @TypeGraphQL.Field(_type => String, {
    nullable: true,
    description: undefined
  })
  lt?: string | null | undefined;

  @TypeGraphQL.Field(_type => String, {
    nullable: true,
    description: undefined
  })
  lte?: string | null | undefined;

  @TypeGraphQL.Field(_type => String, {
    nullable: true,
    description: undefined
  })
  gt?: string | null | undefined;

  @TypeGraphQL.Field(_type => String, {
    nullable: true,
    description: undefined
  })
  gte?: string | null | undefined;

  @TypeGraphQL.Field(_type => String, {
    nullable: true,
    description: undefined
  })
  contains?: string | null | undefined;

  @TypeGraphQL.Field(_type => String, {
    nullable: true,
    description: undefined
  })
  startsWith?: string | null | undefined;

  @TypeGraphQL.Field(_type => String, {
    nullable: true,
    description: undefined
  })
  endsWith?: string | null | undefined;
}
