import { prop as Property, getModelForClass } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import { Field, ObjectType } from "../../../src";

import { Rate } from "./rate";
import { User } from "./user";
import { Ref } from "../types";

@ObjectType()
export class Recipe {
  @Field()
  readonly _id: ObjectId;

  @Field()
  @Property({ required: true })
  title: string;

  @Field({ nullable: true })
  @Property()
  description?: string;

  @Field(type => [Rate])
  @Property({ type: () => Rate, default: [] })
  ratings: Rate[];

  @Field(type => User)
  @Property({ ref: User, required: true })
  author: Ref<User>;
}

export const RecipeModel = getModelForClass(Recipe);
