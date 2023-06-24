import { Types } from "mongoose";
import { Field, InputType, Int } from "type-graphql";

@InputType()
export class RatingInput {
  @Field()
  recipeId!: Types.ObjectId;

  @Field(_type => Int)
  value!: number;
}
