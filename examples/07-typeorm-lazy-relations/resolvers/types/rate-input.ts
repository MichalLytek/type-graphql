import { GraphQLInputType, Field, Int, ID } from "../../../../src";

@GraphQLInputType()
export class RateInput {
  @Field(type => ID)
  recipeId: string;

  @Field(type => Int)
  value: number;
}
