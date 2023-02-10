import { Types } from "mongoose";
import { InputType, Field, Int } from "type-graphql";

@InputType()
export class RateInput {
  @Field()
  recipeId: Types.ObjectId;

  @Field(type => Int)
  value: number;
}
