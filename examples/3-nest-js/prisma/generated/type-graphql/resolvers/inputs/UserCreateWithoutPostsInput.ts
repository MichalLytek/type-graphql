import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";

@TypeGraphQL.InputType({
  isAbstract: true,
  description: undefined,
})
export class UserCreateWithoutPostsInput {
  @TypeGraphQL.Field(_type => String, {
    nullable: true,
    description: undefined
  })
  id?: string | null | undefined;

  @TypeGraphQL.Field(_type => String, {
    nullable: false,
    description: undefined
  })
  email!: string;

  @TypeGraphQL.Field(_type => String, {
    nullable: true,
    description: undefined
  })
  name?: string | null | undefined;
}
