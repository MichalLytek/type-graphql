import * as TypeGraphQL from "type-graphql";

@TypeGraphQL.InputType({
  isAbstract: true,
  description: undefined,
})
export class BooleanFilter {
  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true,
    description: undefined
  })
  equals?: boolean | null;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true,
    description: undefined
  })
  not?: boolean | null;
}
