import * as TypeGraphQL from "type-graphql";

@TypeGraphQL.InputType({
  isAbstract: true,
  description: undefined,
})
export class FirstNameLastNameCompoundUniqueInput {
  @TypeGraphQL.Field(_type => String, {
    nullable: false,
    description: undefined
  })
  firstName!: string;

  @TypeGraphQL.Field(_type => String, {
    nullable: false,
    description: undefined
  })
  lastName!: string;
}
