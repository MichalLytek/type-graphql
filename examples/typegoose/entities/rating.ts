import { prop as Property } from "@typegoose/typegoose";
import { Field, Int, ObjectType } from "type-graphql";
import { User } from "./user";
import { Ref } from "../types";

@ObjectType()
export class Rating {
  @Field(_type => Int)
  @Property({ required: true })
  value!: number;

  @Field()
  @Property({ default: new Date(), required: true })
  date!: Date;

  @Field(_type => User)
  @Property({ ref: User, required: true })
  user!: Ref<User>;
}
