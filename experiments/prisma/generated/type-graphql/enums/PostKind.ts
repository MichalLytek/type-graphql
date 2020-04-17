import * as TypeGraphQL from "type-graphql";

export enum PostKind {
  BLOG = "BLOG",
  ADVERT = "ADVERT"
}
TypeGraphQL.registerEnumType(PostKind, {
  name: "PostKind",
  description: undefined,
});
