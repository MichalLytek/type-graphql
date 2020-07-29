import * as TypeGraphQL from "type-graphql";

export enum CategoryDistinctFieldEnum {
  name = "name",
  slug = "slug",
  number = "number"
}
TypeGraphQL.registerEnumType(CategoryDistinctFieldEnum, {
  name: "CategoryDistinctFieldEnum",
  description: undefined,
});
