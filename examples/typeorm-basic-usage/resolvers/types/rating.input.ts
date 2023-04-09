import { Field, InputType, Int } from "type-graphql";

@InputType()
export class RatingInput {
  @Field(_type => Int)
  recipeId: number;

  @Field(_type => Int)
  value: number;
}
