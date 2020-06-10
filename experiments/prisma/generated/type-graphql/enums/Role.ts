import * as TypeGraphQL from "type-graphql";

/** Role enum doc */
export enum Role {
  USER = "USER",
  ADMIN = "ADMIN"
}
TypeGraphQL.registerEnumType(Role, {
  name: "Role",
  description: "Role enum doc",
});
