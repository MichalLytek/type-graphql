import * as TypeGraphQL from "type-graphql";

export enum PatientDistinctFieldEnum {
  firstName = "firstName",
  lastName = "lastName",
  email = "email"
}
TypeGraphQL.registerEnumType(PatientDistinctFieldEnum, {
  name: "PatientDistinctFieldEnum",
  description: undefined,
});
