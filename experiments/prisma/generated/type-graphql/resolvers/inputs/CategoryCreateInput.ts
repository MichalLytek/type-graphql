import * as TypeGraphQL from "type-graphql";

@TypeGraphQL.InputType({
  isAbstract: true,
  description: undefined,
})
export class CategoryCreateInput {
  @TypeGraphQL.Field(_type => String, {
    nullable: false,
    description: undefined
  })
  name!: string;

  @TypeGraphQL.Field(_type => String, {
    nullable: false,
    description: undefined
  })
  slug!: string;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false,
    description: undefined
  })
  number!: number;
}
