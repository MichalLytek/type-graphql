import { InputType, Field, Int } from "type-graphql";

@InputType()
export class RateInput {
  @Field(type => Int)
  recipeId: number;

  @Field(type => Int)
  value: number;
}
