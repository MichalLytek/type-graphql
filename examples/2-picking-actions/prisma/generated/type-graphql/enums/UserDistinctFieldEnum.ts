import * as TypeGraphQL from "type-graphql";

export enum UserDistinctFieldEnum {
  id = "id",
  email = "email",
  name = "name"
}
TypeGraphQL.registerEnumType(UserDistinctFieldEnum, {
  name: "UserDistinctFieldEnum",
  description: undefined,
});
