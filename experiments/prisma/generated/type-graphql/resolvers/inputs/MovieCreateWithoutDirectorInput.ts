import * as TypeGraphQL from "type-graphql";

@TypeGraphQL.InputType({
  isAbstract: true,
  description: undefined,
})
export class MovieCreateWithoutDirectorInput {
  @TypeGraphQL.Field(_type => String, {
    nullable: false,
    description: undefined
  })
  title!: string;
}
