import * as TypeGraphQL from "type-graphql";

@TypeGraphQL.InputType({
  isAbstract: true,
  description: undefined,
})
export class CategoryUpdateInput {
  @TypeGraphQL.Field(_type => String, {
    nullable: true,
    description: undefined
  })
  name?: string | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true,
    description: undefined
  })
  slug?: string | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true,
    description: undefined
  })
  number?: number | null;
}
