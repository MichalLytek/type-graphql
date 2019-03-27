import { ObjectId } from "mongodb";
import { InputType, Field, Int } from "../../../../src";

@InputType()
export class RateInput {
  @Field()
  recipeId: ObjectId;

  @Field(type => Int)
  value: number;
}
