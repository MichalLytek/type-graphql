import * as TypeGraphQL from "type-graphql";

export enum PostDistinctFieldEnum {
  uuid = "uuid",
  createdAt = "createdAt",
  updatedAt = "updatedAt",
  published = "published",
  title = "title",
  subtitle = "subtitle",
  content = "content",
  authorId = "authorId",
  editorId = "editorId",
  kind = "kind",
  metadata = "metadata"
}
TypeGraphQL.registerEnumType(PostDistinctFieldEnum, {
  name: "PostDistinctFieldEnum",
  description: undefined,
});
