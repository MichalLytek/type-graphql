import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { JsonValue, InputJsonValue } from "../../../client";
import { BoolFieldUpdateOperationsInput } from "../inputs/BoolFieldUpdateOperationsInput";
import { ClientUpdateOneRequiredWithoutPostsInput } from "../inputs/ClientUpdateOneRequiredWithoutPostsInput";
import { DateTimeFieldUpdateOperationsInput } from "../inputs/DateTimeFieldUpdateOperationsInput";
import { NullableEnumPostKindFieldUpdateOperationsInput } from "../inputs/NullableEnumPostKindFieldUpdateOperationsInput";
import { NullableStringFieldUpdateOperationsInput } from "../inputs/NullableStringFieldUpdateOperationsInput";
import { StringFieldUpdateOperationsInput } from "../inputs/StringFieldUpdateOperationsInput";

@TypeGraphQL.InputType({
  isAbstract: true,
  description: undefined,
})
export class PostUpdateWithoutEditorDataInput {
  @TypeGraphQL.Field(_type => StringFieldUpdateOperationsInput, {
    nullable: true,
    description: undefined
  })
  uuid?: StringFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => DateTimeFieldUpdateOperationsInput, {
    nullable: true,
    description: undefined
  })
  createdAt?: DateTimeFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => DateTimeFieldUpdateOperationsInput, {
    nullable: true,
    description: undefined
  })
  updatedAt?: DateTimeFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => BoolFieldUpdateOperationsInput, {
    nullable: true,
    description: undefined
  })
  published?: BoolFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => StringFieldUpdateOperationsInput, {
    nullable: true,
    description: undefined
  })
  title?: StringFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => StringFieldUpdateOperationsInput, {
    nullable: true,
    description: undefined
  })
  subtitle?: StringFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => NullableStringFieldUpdateOperationsInput, {
    nullable: true,
    description: undefined
  })
  content?: NullableStringFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => NullableEnumPostKindFieldUpdateOperationsInput, {
    nullable: true,
    description: undefined
  })
  kind?: NullableEnumPostKindFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => GraphQLJSON, {
    nullable: true,
    description: undefined
  })
  metadata?: InputJsonValue | undefined;

  @TypeGraphQL.Field(_type => ClientUpdateOneRequiredWithoutPostsInput, {
    nullable: true,
    description: undefined
  })
  author?: ClientUpdateOneRequiredWithoutPostsInput | undefined;
}
