import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { PostUpdateManyWithoutAuthorInput } from "../inputs/PostUpdateManyWithoutAuthorInput";

@TypeGraphQL.InputType({
  isAbstract: true,
  description: undefined,
})
export class UserUpdateInput {
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

  @TypeGraphQL.Field(_type => String, {
    nullable: true,
    description: undefined
  })
  name?: string | null | undefined;

  @TypeGraphQL.Field(_type => PostUpdateManyWithoutAuthorInput, {
    nullable: true,
    description: undefined
  })
  posts?: PostUpdateManyWithoutAuthorInput | null | undefined;
}
