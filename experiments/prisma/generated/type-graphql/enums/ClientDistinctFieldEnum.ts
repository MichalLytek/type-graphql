import * as TypeGraphQL from "type-graphql";

export enum ClientDistinctFieldEnum {
  id = "id",
  email = "email",
  firstName = "name",
  age = "age",
  accountBalance = "balance",
  amount = "amount",
  role = "role"
}
TypeGraphQL.registerEnumType(ClientDistinctFieldEnum, {
  name: "ClientDistinctFieldEnum",
  description: undefined,
});
