import { prop as Property, Typegoose } from "typegoose";
import { ObjectId } from "mongodb";
import { Field, ObjectType } from "../../../src";

@ObjectType()
export class User extends Typegoose {
  @Field()
  readonly _id: ObjectId;

  @Field()
  @Property({ required: true })
  email: string;

  @Field({ nullable: true })
  @Property()
  nickname?: string;

  @Property({ required: true })
  password: string;
}
export const UserModel = new User().getModelForClass(User);
