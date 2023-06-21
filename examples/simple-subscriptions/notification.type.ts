import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
export class Notification {
  @Field(() => ID)
  id!: number;

  @Field({ nullable: true })
  message?: string;

  @Field(() => Date)
  date!: Date;
}

export interface NotificationPayload {
  id: number;
  message?: string;
}
