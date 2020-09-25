import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { JsonValue, InputJsonValue } from "../../../client";
import { PostCreateOrConnectWithoutUserInput } from "../inputs/PostCreateOrConnectWithoutUserInput";
import { PostCreateWithoutEditorInput } from "../inputs/PostCreateWithoutEditorInput";
import { PostScalarWhereInput } from "../inputs/PostScalarWhereInput";
import { PostUpdateManyWithWhereNestedInput } from "../inputs/PostUpdateManyWithWhereNestedInput";
import { PostUpdateWithWhereUniqueWithoutEditorInput } from "../inputs/PostUpdateWithWhereUniqueWithoutEditorInput";
import { PostUpsertWithWhereUniqueWithoutEditorInput } from "../inputs/PostUpsertWithWhereUniqueWithoutEditorInput";
import { PostWhereUniqueInput } from "../inputs/PostWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true,
  description: undefined,
})
export class PostUpdateManyWithoutEditorInput {
  @TypeGraphQL.Field(_type => [PostCreateWithoutEditorInput], {
    nullable: true,
    description: undefined
  })
  create?: PostCreateWithoutEditorInput[] | undefined;

  @TypeGraphQL.Field(_type => [PostWhereUniqueInput], {
    nullable: true,
    description: undefined
  })
  connect?: PostWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [PostWhereUniqueInput], {
    nullable: true,
    description: undefined
  })
  set?: PostWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [PostWhereUniqueInput], {
    nullable: true,
    description: undefined
  })
  disconnect?: PostWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [PostWhereUniqueInput], {
    nullable: true,
    description: undefined
  })
  delete?: PostWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [PostUpdateWithWhereUniqueWithoutEditorInput], {
    nullable: true,
    description: undefined
  })
  update?: PostUpdateWithWhereUniqueWithoutEditorInput[] | undefined;

  @TypeGraphQL.Field(_type => [PostUpdateManyWithWhereNestedInput], {
    nullable: true,
    description: undefined
  })
  updateMany?: PostUpdateManyWithWhereNestedInput[] | undefined;

  @TypeGraphQL.Field(_type => [PostScalarWhereInput], {
    nullable: true,
    description: undefined
  })
  deleteMany?: PostScalarWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [PostUpsertWithWhereUniqueWithoutEditorInput], {
    nullable: true,
    description: undefined
  })
  upsert?: PostUpsertWithWhereUniqueWithoutEditorInput[] | undefined;

  @TypeGraphQL.Field(_type => [PostCreateOrConnectWithoutUserInput], {
    nullable: true,
    description: undefined
  })
  connectOrCreate?: PostCreateOrConnectWithoutUserInput[] | undefined;
}
