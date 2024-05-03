import { prop as Property, getModelForClass } from "@typegoose/typegoose";
import { Types } from "mongoose";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class User {
  @Field()
  readonly id!: Types.ObjectId;

  @Field()
  @Property({ required: true })
  email!: string;

  @Field({ nullable: true })
  @Property()
  nickname?: string;

  @Property({ required: true })
  password!: string;
}

export const UserModel = getModelForClass(User);
