import { Types } from "mongoose";
import { InputType, Field, Int } from "../../../../src";

@InputType()
export class RateInput {
  @Field()
  recipeId: Types.ObjectId;

  @Field(type => Int)
  value: number;
}
