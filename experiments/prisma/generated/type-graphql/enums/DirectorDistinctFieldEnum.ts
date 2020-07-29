import * as TypeGraphQL from "type-graphql";

export enum DirectorDistinctFieldEnum {
  firstName = "firstName",
  lastName = "lastName"
}
TypeGraphQL.registerEnumType(DirectorDistinctFieldEnum, {
  name: "DirectorDistinctFieldEnum",
  description: undefined,
});
