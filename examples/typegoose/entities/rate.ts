import { prop as Property } from "@typegoose/typegoose";
import { ObjectType, Field, Int } from "../../../src";

import { User } from "./user";
import { Ref } from "../types";

@ObjectType()
export class Rate {
  @Field(type => Int)
  @Property({ required: true })
  value: number;

  @Field()
  @Property({ default: new Date(), required: true })
  date: Date;

  @Field(type => User)
  @Property({ ref: User, required: true })
  user: Ref<User>;
}
