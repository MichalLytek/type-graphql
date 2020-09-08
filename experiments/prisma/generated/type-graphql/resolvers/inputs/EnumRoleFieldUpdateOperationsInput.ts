import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { JsonValue, InputJsonValue } from "../../../client";
import { Role } from "../../enums/Role";

@TypeGraphQL.InputType({
  isAbstract: true,
  description: undefined,
})
export class EnumRoleFieldUpdateOperationsInput {
  @TypeGraphQL.Field(_type => Role, {
    nullable: true,
    description: undefined
  })
  set?: typeof Role[keyof typeof Role] | undefined;
}
