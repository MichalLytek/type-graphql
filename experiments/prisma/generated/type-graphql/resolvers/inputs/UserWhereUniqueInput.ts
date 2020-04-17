import * as TypeGraphQL from "type-graphql";

@TypeGraphQL.InputType({
  isAbstract: true,
  description: undefined,
})
export class UserWhereUniqueInput {
  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true,
    description: undefined
  })
  id?: number | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true,
    description: undefined
  })
  email?: string | null;
}
