import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { Client } from "../models/Client";
import { PostKind } from "../enums/PostKind";

@TypeGraphQL.ObjectType({
  isAbstract: true,
  description: undefined,
})
export class Post {
  @TypeGraphQL.Field(_type => String, {
    nullable: false,
    description: undefined,
  })
  uuid!: string;

  @TypeGraphQL.Field(_type => Date, {
    nullable: false,
    description: undefined,
  })
  createdAt!: Date;

  @TypeGraphQL.Field(_type => Date, {
    nullable: false,
    description: undefined,
  })
  updatedAt!: Date;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: false,
    description: undefined,
  })
  published!: boolean;

  @TypeGraphQL.Field(_type => String, {
    nullable: false,
    description: undefined,
  })
  title!: string;

  @TypeGraphQL.Field(_type => String, {
    nullable: true,
    description: undefined,
  })
  content?: string | null | undefined;

  author?: Client;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false,
    description: undefined,
  })
  authorId!: number;

  @TypeGraphQL.Field(_type => PostKind, {
    nullable: true,
    description: undefined,
  })
  kind?: keyof typeof PostKind | null | undefined;

  @TypeGraphQL.Field(_type => GraphQLJSON, {
    nullable: false,
    description: undefined,
  })
  metadata!: object;
}
