import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { JsonValue, InputJsonValue } from "../../../client";
import { PostUpdateWithoutEditorDataInput } from "../inputs/PostUpdateWithoutEditorDataInput";
import { PostWhereUniqueInput } from "../inputs/PostWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true,
  description: undefined,
})
export class PostUpdateWithWhereUniqueWithoutEditorInput {
  @TypeGraphQL.Field(_type => PostWhereUniqueInput, {
    nullable: false,
    description: undefined
  })
  where!: PostWhereUniqueInput;

  @TypeGraphQL.Field(_type => PostUpdateWithoutEditorDataInput, {
    nullable: false,
    description: undefined
  })
  data!: PostUpdateWithoutEditorDataInput;
}
