import { Field, ID, InputType } from "../../src";

import { Comment } from "./comment.type";

@InputType()
export class CommentInput implements Partial<Comment> {
  @Field(type => ID)
  recipeId: string;

  @Field({ nullable: true })
  nickname?: string;

  @Field()
  content: string;
}
