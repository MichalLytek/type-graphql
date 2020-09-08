import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { JsonValue, InputJsonValue } from "../../../client";
import { PostKind } from "../../enums/PostKind";

@TypeGraphQL.InputType({
  isAbstract: true,
  description: undefined,
})
export class NullableEnumPostKindFieldUpdateOperationsInput {
  @TypeGraphQL.Field(_type => PostKind, {
    nullable: true,
    description: undefined
  })
  set?: typeof PostKind[keyof typeof PostKind] | undefined;
}
