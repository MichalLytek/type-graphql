import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
export class Notification {
  @Field(type => ID)
  id: number;

  @Field({ nullable: true })
  message?: string;

  @Field(type => Date)
  date: Date;
}

export interface NotificationPayload {
  id: number;
  message?: string;
}
