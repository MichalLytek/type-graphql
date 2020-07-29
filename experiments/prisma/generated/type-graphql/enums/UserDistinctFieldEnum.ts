import * as TypeGraphQL from "type-graphql";

export enum UserDistinctFieldEnum {
  id = "id",
  email = "email",
  name = "name",
  age = "age",
  balance = "balance",
  amount = "amount",
  role = "role"
}
TypeGraphQL.registerEnumType(UserDistinctFieldEnum, {
  name: "UserDistinctFieldEnum",
  description: undefined,
});
