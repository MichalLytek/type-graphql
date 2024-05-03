import { Field, ID, ObjectType } from "type-graphql";
import { Comment } from "./comment.type";

@ObjectType()
export class Recipe {
  @Field(_type => ID)
  id!: string;

  @Field()
  title!: string;

  @Field({ nullable: true })
  description?: string;

  @Field(_type => [Comment])
  comments!: Comment[];
}
