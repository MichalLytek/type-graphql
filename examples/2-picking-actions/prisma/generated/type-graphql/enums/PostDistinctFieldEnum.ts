import * as TypeGraphQL from "type-graphql";

export enum PostDistinctFieldEnum {
  id = "id",
  createdAt = "createdAt",
  updatedAt = "updatedAt",
  published = "published",
  title = "title",
  content = "content",
  authorId = "authorId"
}
TypeGraphQL.registerEnumType(PostDistinctFieldEnum, {
  name: "PostDistinctFieldEnum",
  description: undefined,
});
