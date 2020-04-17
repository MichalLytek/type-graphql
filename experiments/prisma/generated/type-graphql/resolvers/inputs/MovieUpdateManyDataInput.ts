import * as TypeGraphQL from "type-graphql";

@TypeGraphQL.InputType({
  isAbstract: true,
  description: undefined,
})
export class MovieUpdateManyDataInput {
  @TypeGraphQL.Field(_type => String, {
    nullable: true,
    description: undefined
  })
  title?: string | null;
}
