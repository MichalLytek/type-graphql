import { InputType, Field, Int, ID } from '../../../../src'

@InputType()
export class RateInput {
  @Field(type => ID)
  recipeId: string

  @Field(type => Int)
  value: number
}
