import * as TypeGraphQL from "type-graphql";

@TypeGraphQL.InputType({
  isAbstract: true,
  description: undefined,
})
export class PatientUpdateManyMutationInput {
  @TypeGraphQL.Field(_type => String, {
    nullable: true,
    description: undefined
  })
  firstName?: string | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true,
    description: undefined
  })
  lastName?: string | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true,
    description: undefined
  })
  email?: string | null;
}
