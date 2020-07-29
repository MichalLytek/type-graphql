import * as TypeGraphQL from "type-graphql";

export enum PostDistinctFieldEnum {
  uuid = "uuid",
  createdAt = "createdAt",
  updatedAt = "updatedAt",
  published = "published",
  title = "title",
  content = "content",
  authorId = "authorId",
  kind = "kind",
  metadata = "metadata"
}
TypeGraphQL.registerEnumType(PostDistinctFieldEnum, {
  name: "PostDistinctFieldEnum",
  description: undefined,
});
