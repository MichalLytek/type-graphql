import { InputType, Field, Int, ID } from "../../../../src";

@InputType()
export class RateInput {
  @Field(type => Int)
  recipeId: number;

  @Field(type => Int)
  value: number;
}
