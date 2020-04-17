import * as TypeGraphQL from "type-graphql";

export enum OrderByArg {
  asc = "asc",
  desc = "desc"
}
TypeGraphQL.registerEnumType(OrderByArg, {
  name: "OrderByArg",
  description: undefined,
});
