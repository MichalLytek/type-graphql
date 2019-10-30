import { registerEnumType, ObjectType, Field, Int, Float, ID, Resolver, FieldResolver, Root, Ctx, InputType, Query, Mutation, Arg, ArgsType, Args } from "type-graphql";
import { PostCreateWithoutAuthorInput } from "../inputs/PostCreateWithoutAuthorInput";
import { PostScalarWhereInput } from "../inputs/PostScalarWhereInput";
import { PostUpdateManyWithWhereNestedInput } from "../inputs/PostUpdateManyWithWhereNestedInput";
import { PostUpdateWithWhereUniqueWithoutAuthorInput } from "../inputs/PostUpdateWithWhereUniqueWithoutAuthorInput";
import { PostUpsertWithWhereUniqueWithoutAuthorInput } from "../inputs/PostUpsertWithWhereUniqueWithoutAuthorInput";
import { PostWhereUniqueInput } from "../inputs/PostWhereUniqueInput";

@InputType({
  isAbstract: true,
  description: undefined,
})
export class PostUpdateManyWithoutAuthorInput {
  @Field(_type => [PostCreateWithoutAuthorInput], {
    nullable: true,
    description: undefined
  })
  create?: PostCreateWithoutAuthorInput[] | null;

  @Field(_type => [PostWhereUniqueInput], {
    nullable: true,
    description: undefined
  })
  connect?: PostWhereUniqueInput[] | null;

  @Field(_type => [PostWhereUniqueInput], {
    nullable: true,
    description: undefined
  })
  set?: PostWhereUniqueInput[] | null;

  @Field(_type => [PostWhereUniqueInput], {
    nullable: true,
    description: undefined
  })
  disconnect?: PostWhereUniqueInput[] | null;

  @Field(_type => [PostWhereUniqueInput], {
    nullable: true,
    description: undefined
  })
  delete?: PostWhereUniqueInput[] | null;

  @Field(_type => [PostUpdateWithWhereUniqueWithoutAuthorInput], {
    nullable: true,
    description: undefined
  })
  update?: PostUpdateWithWhereUniqueWithoutAuthorInput[] | null;

  @Field(_type => [PostUpdateManyWithWhereNestedInput], {
    nullable: true,
    description: undefined
  })
  updateMany?: PostUpdateManyWithWhereNestedInput[] | null;

  @Field(_type => [PostScalarWhereInput], {
    nullable: true,
    description: undefined
  })
  deleteMany?: PostScalarWhereInput[] | null;

  @Field(_type => [PostUpsertWithWhereUniqueWithoutAuthorInput], {
    nullable: true,
    description: undefined
  })
  upsert?: PostUpsertWithWhereUniqueWithoutAuthorInput[] | null;
}
