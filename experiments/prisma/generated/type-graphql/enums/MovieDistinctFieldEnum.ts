import * as TypeGraphQL from "type-graphql";

export enum MovieDistinctFieldEnum {
  directorFirstName = "directorFirstName",
  directorLastName = "directorLastName",
  title = "title"
}
TypeGraphQL.registerEnumType(MovieDistinctFieldEnum, {
  name: "MovieDistinctFieldEnum",
  description: undefined,
});
