import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { JsonValue, InputJsonValue } from "../../../client";
import { ClientCreateOrConnectWithoutpostInput } from "../inputs/ClientCreateOrConnectWithoutpostInput";
import { ClientCreateWithoutEditorPostsInput } from "../inputs/ClientCreateWithoutEditorPostsInput";
import { ClientUpdateWithoutEditorPostsDataInput } from "../inputs/ClientUpdateWithoutEditorPostsDataInput";
import { ClientUpsertWithoutEditorPostsInput } from "../inputs/ClientUpsertWithoutEditorPostsInput";
import { ClientWhereUniqueInput } from "../inputs/ClientWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true,
  description: undefined,
})
export class ClientUpdateOneWithoutEditorPostsInput {
  @TypeGraphQL.Field(_type => ClientCreateWithoutEditorPostsInput, {
    nullable: true,
    description: undefined
  })
  create?: ClientCreateWithoutEditorPostsInput | undefined;

  @TypeGraphQL.Field(_type => ClientWhereUniqueInput, {
    nullable: true,
    description: undefined
  })
  connect?: ClientWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true,
    description: undefined
  })
  disconnect?: boolean | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true,
    description: undefined
  })
  delete?: boolean | undefined;

  @TypeGraphQL.Field(_type => ClientUpdateWithoutEditorPostsDataInput, {
    nullable: true,
    description: undefined
  })
  update?: ClientUpdateWithoutEditorPostsDataInput | undefined;

  @TypeGraphQL.Field(_type => ClientUpsertWithoutEditorPostsInput, {
    nullable: true,
    description: undefined
  })
  upsert?: ClientUpsertWithoutEditorPostsInput | undefined;

  @TypeGraphQL.Field(_type => ClientCreateOrConnectWithoutpostInput, {
    nullable: true,
    description: undefined
  })
  connectOrCreate?: ClientCreateOrConnectWithoutpostInput | undefined;
}
