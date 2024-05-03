import { Field, ID, InputType } from "type-graphql";
import { type Comment } from "./comment.type";

@InputType()
export class CommentInput implements Partial<Comment> {
  @Field(_type => ID)
  recipeId!: string;

  @Field({ nullable: true })
  nickname?: string;

  @Field()
  content!: string;
}
