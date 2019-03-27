import { prop as Property, arrayProp as ArrayProperty, Typegoose, Ref } from "typegoose";
import { ObjectId } from "mongodb";
import { Field, ObjectType } from "../../../src";

import { Rate } from "./rate";
import { User } from "./user";

@ObjectType()
export class Recipe extends Typegoose {
  @Field()
  readonly _id: ObjectId;

  @Field()
  @Property({ required: true })
  title: string;

  @Field({ nullable: true })
  @Property()
  description?: string;

  @Field(type => [Rate])
  @ArrayProperty({ items: Rate, default: [] })
  ratings: Rate[];

  @Field(type => User)
  @Property({ ref: User, required: true })
  author: Ref<User>;
}

export const RecipeModel = new Recipe().getModelForClass(Recipe);
