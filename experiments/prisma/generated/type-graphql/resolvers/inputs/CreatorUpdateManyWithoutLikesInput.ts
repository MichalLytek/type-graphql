import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { JsonValue, InputJsonValue } from "../../../client";
import { CreatorCreateOrConnectWithoutProblemInput } from "../inputs/CreatorCreateOrConnectWithoutProblemInput";
import { CreatorCreateWithoutLikesInput } from "../inputs/CreatorCreateWithoutLikesInput";
import { CreatorScalarWhereInput } from "../inputs/CreatorScalarWhereInput";
import { CreatorUpdateManyWithWhereNestedInput } from "../inputs/CreatorUpdateManyWithWhereNestedInput";
import { CreatorUpdateWithWhereUniqueWithoutLikesInput } from "../inputs/CreatorUpdateWithWhereUniqueWithoutLikesInput";
import { CreatorUpsertWithWhereUniqueWithoutLikesInput } from "../inputs/CreatorUpsertWithWhereUniqueWithoutLikesInput";
import { CreatorWhereUniqueInput } from "../inputs/CreatorWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true,
  description: undefined,
})
export class CreatorUpdateManyWithoutLikesInput {
  @TypeGraphQL.Field(_type => [CreatorCreateWithoutLikesInput], {
    nullable: true,
    description: undefined
  })
  create?: CreatorCreateWithoutLikesInput[] | undefined;

  @TypeGraphQL.Field(_type => [CreatorWhereUniqueInput], {
    nullable: true,
    description: undefined
  })
  connect?: CreatorWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [CreatorWhereUniqueInput], {
    nullable: true,
    description: undefined
  })
  set?: CreatorWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [CreatorWhereUniqueInput], {
    nullable: true,
    description: undefined
  })
  disconnect?: CreatorWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [CreatorWhereUniqueInput], {
    nullable: true,
    description: undefined
  })
  delete?: CreatorWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [CreatorUpdateWithWhereUniqueWithoutLikesInput], {
    nullable: true,
    description: undefined
  })
  update?: CreatorUpdateWithWhereUniqueWithoutLikesInput[] | undefined;

  @TypeGraphQL.Field(_type => [CreatorUpdateManyWithWhereNestedInput], {
    nullable: true,
    description: undefined
  })
  updateMany?: CreatorUpdateManyWithWhereNestedInput[] | undefined;

  @TypeGraphQL.Field(_type => [CreatorScalarWhereInput], {
    nullable: true,
    description: undefined
  })
  deleteMany?: CreatorScalarWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [CreatorUpsertWithWhereUniqueWithoutLikesInput], {
    nullable: true,
    description: undefined
  })
  upsert?: CreatorUpsertWithWhereUniqueWithoutLikesInput[] | undefined;

  @TypeGraphQL.Field(_type => [CreatorCreateOrConnectWithoutProblemInput], {
    nullable: true,
    description: undefined
  })
  connectOrCreate?: CreatorCreateOrConnectWithoutProblemInput[] | undefined;
}
