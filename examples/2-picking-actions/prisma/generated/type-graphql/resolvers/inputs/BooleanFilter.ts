import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";

@TypeGraphQL.InputType({
  isAbstract: true,
  description: undefined,
})
export class BooleanFilter {
  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true,
    description: undefined
  })
  equals?: boolean | null | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true,
    description: undefined
  })
  not?: boolean | null | undefined;
}
