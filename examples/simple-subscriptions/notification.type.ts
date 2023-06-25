import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class Notification {
  @Field(_type => ID)
  id!: number;

  @Field({ nullable: true })
  message?: string;

  @Field(_type => Date)
  date!: Date;
}

export type NotificationPayload = {
  id: number;
  message?: string;
};
