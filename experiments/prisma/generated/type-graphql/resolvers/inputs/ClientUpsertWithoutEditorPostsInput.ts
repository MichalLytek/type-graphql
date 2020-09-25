import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { JsonValue, InputJsonValue } from "../../../client";
import { ClientCreateWithoutEditorPostsInput } from "../inputs/ClientCreateWithoutEditorPostsInput";
import { ClientUpdateWithoutEditorPostsDataInput } from "../inputs/ClientUpdateWithoutEditorPostsDataInput";

@TypeGraphQL.InputType({
  isAbstract: true,
  description: undefined,
})
export class ClientUpsertWithoutEditorPostsInput {
  @TypeGraphQL.Field(_type => ClientUpdateWithoutEditorPostsDataInput, {
    nullable: false,
    description: undefined
  })
  update!: ClientUpdateWithoutEditorPostsDataInput;

  @TypeGraphQL.Field(_type => ClientCreateWithoutEditorPostsInput, {
    nullable: false,
    description: undefined
  })
  create!: ClientCreateWithoutEditorPostsInput;
}
