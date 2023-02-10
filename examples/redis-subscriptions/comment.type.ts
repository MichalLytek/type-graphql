import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class Comment {
  @Field({ nullable: true })
  nickname?: string;

  @Field()
  content: string;

  @Field()
  date: Date;
}
