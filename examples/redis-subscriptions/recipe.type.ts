import { ObjectType, Field, ID } from "type-graphql";

import { Comment } from "./comment.type";

@ObjectType()
export class Recipe {
  @Field(type => ID)
  id: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field(type => [Comment])
  comments: Comment[];
}
