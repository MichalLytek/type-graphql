import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { JsonValue, InputJsonValue } from "../../../client";
import { PostCreateWithoutEditorInput } from "../inputs/PostCreateWithoutEditorInput";
import { PostUpdateWithoutEditorDataInput } from "../inputs/PostUpdateWithoutEditorDataInput";
import { PostWhereUniqueInput } from "../inputs/PostWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true,
  description: undefined,
})
export class PostUpsertWithWhereUniqueWithoutEditorInput {
  @TypeGraphQL.Field(_type => PostWhereUniqueInput, {
    nullable: false,
    description: undefined
  })
  where!: PostWhereUniqueInput;

  @TypeGraphQL.Field(_type => PostUpdateWithoutEditorDataInput, {
    nullable: false,
    description: undefined
  })
  update!: PostUpdateWithoutEditorDataInput;

  @TypeGraphQL.Field(_type => PostCreateWithoutEditorInput, {
    nullable: false,
    description: undefined
  })
  create!: PostCreateWithoutEditorInput;
}
