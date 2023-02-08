import { InputType, Field, Int } from "../../../../src";

@InputType()
export class RateInput {
  @Field(type => Int)
  recipeId: number;

  @Field(type => Int)
  value: number;
}
