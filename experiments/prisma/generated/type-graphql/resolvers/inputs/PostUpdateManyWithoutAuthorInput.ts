import * as TypeGraphQL from "type-graphql";
import { PostCreateWithoutAuthorInput } from "../inputs/PostCreateWithoutAuthorInput";
import { PostScalarWhereInput } from "../inputs/PostScalarWhereInput";
import { PostUpdateManyWithWhereNestedInput } from "../inputs/PostUpdateManyWithWhereNestedInput";
import { PostUpdateWithWhereUniqueWithoutAuthorInput } from "../inputs/PostUpdateWithWhereUniqueWithoutAuthorInput";
import { PostUpsertWithWhereUniqueWithoutAuthorInput } from "../inputs/PostUpsertWithWhereUniqueWithoutAuthorInput";
import { PostWhereUniqueInput } from "../inputs/PostWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true,
  description: undefined,
})
export class PostUpdateManyWithoutAuthorInput {
  @TypeGraphQL.Field(_type => [PostCreateWithoutAuthorInput], {
    nullable: true,
    description: undefined
  })
  create?: PostCreateWithoutAuthorInput[] | null;

  @TypeGraphQL.Field(_type => [PostWhereUniqueInput], {
    nullable: true,
    description: undefined
  })
  connect?: PostWhereUniqueInput[] | null;

  @TypeGraphQL.Field(_type => [PostWhereUniqueInput], {
    nullable: true,
    description: undefined
  })
  set?: PostWhereUniqueInput[] | null;

  @TypeGraphQL.Field(_type => [PostWhereUniqueInput], {
    nullable: true,
    description: undefined
  })
  disconnect?: PostWhereUniqueInput[] | null;

  @TypeGraphQL.Field(_type => [PostWhereUniqueInput], {
    nullable: true,
    description: undefined
  })
  delete?: PostWhereUniqueInput[] | null;

  @TypeGraphQL.Field(_type => [PostUpdateWithWhereUniqueWithoutAuthorInput], {
    nullable: true,
    description: undefined
  })
  update?: PostUpdateWithWhereUniqueWithoutAuthorInput[] | null;

  @TypeGraphQL.Field(_type => [PostUpdateManyWithWhereNestedInput], {
    nullable: true,
    description: undefined
  })
  updateMany?: PostUpdateManyWithWhereNestedInput[] | null;

  @TypeGraphQL.Field(_type => [PostScalarWhereInput], {
    nullable: true,
    description: undefined
  })
  deleteMany?: PostScalarWhereInput[] | null;

  @TypeGraphQL.Field(_type => [PostUpsertWithWhereUniqueWithoutAuthorInput], {
    nullable: true,
    description: undefined
  })
  upsert?: PostUpsertWithWhereUniqueWithoutAuthorInput[] | null;
}
