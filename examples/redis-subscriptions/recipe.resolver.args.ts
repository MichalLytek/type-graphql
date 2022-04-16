import { ID, Field, ArgsType } from '../../src'

@ArgsType()
export class NewCommentsArgs {
  @Field(type => ID)
  recipeId: string
}
