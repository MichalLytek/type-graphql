import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class Comment {
  @Field({ nullable: true })
  nickname?: string;

  @Field()
  content!: string;

  @Field()
  date!: Date;
}

export interface NewCommentPayload {
  recipeId: string;

  dateString: string; // Limitation of Redis payload serialization

  content: string;

  nickname?: string;
}
