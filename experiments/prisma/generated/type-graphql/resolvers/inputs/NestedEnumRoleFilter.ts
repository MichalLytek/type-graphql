import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { JsonValue, InputJsonValue } from "../../../client";
import { Role } from "../../enums/Role";

@TypeGraphQL.InputType({
  isAbstract: true,
  description: undefined,
})
export class NestedEnumRoleFilter {
  @TypeGraphQL.Field(_type => Role, {
    nullable: true,
    description: undefined
  })
  equals?: keyof typeof Role | undefined;

  @TypeGraphQL.Field(_type => [Role], {
    nullable: true,
    description: undefined
  })
  in?: Array<keyof typeof Role> | undefined;

  @TypeGraphQL.Field(_type => [Role], {
    nullable: true,
    description: undefined
  })
  notIn?: Array<keyof typeof Role> | undefined;

  @TypeGraphQL.Field(_type => NestedEnumRoleFilter, {
    nullable: true,
    description: undefined
  })
  not?: NestedEnumRoleFilter | undefined;
}
