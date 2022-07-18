import { prop as Property, getModelForClass } from "@typegoose/typegoose";
import { Types } from "mongoose";
import { Field, ObjectType } from "../../../src";

@ObjectType()
export class User {
  @Field()
  readonly _id: Types.ObjectId;

  @Field()
  @Property({ required: true })
  email: string;

  @Field({ nullable: true })
  @Property()
  nickname?: string;

  @Property({ required: true })
  password: string;
}

export const UserModel = getModelForClass(User);
