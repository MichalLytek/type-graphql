import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";

@TypeGraphQL.InputType({
  isAbstract: true,
  description: undefined,
})
export class UserWhereUniqueInput {
  @TypeGraphQL.Field(_type => String, {
    nullable: true,
    description: undefined
  })
  id?: string | null | undefined;

  @TypeGraphQL.Field(_type => String, {
    nullable: true,
    description: undefined
  })
  email?: string | null | undefined;
}
