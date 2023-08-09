import { prop as Property, getModelForClass } from "@typegoose/typegoose";
import { Types } from "mongoose";
import { Field, ObjectType } from "type-graphql";
import { Rating } from "./rating";
import { User } from "./user";
import { Ref } from "../types";

@ObjectType()
export class Recipe {
  @Field()
  readonly id!: Types.ObjectId;

  @Field()
  @Property({ required: true })
  title!: string;

  @Field({ nullable: true })
  @Property()
  description?: string;

  @Field(_type => [Rating])
  @Property({ type: () => Rating, default: [] })
  ratings!: Rating[];

  @Field(_type => User)
  @Property({ ref: User, required: true })
  author!: Ref<User>;
}

export const RecipeModel = getModelForClass(Recipe);
