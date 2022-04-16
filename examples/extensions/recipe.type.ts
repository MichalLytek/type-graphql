import { ObjectType, Extensions, Field, Int, Float } from '../../src'

import { LogMessage } from './log-message.decorator'

@ObjectType()
// log a message when any Recipe field is accessed
@LogMessage('Recipe field accessed')
export class Recipe {
  @Field()
  title: string

  @Field({ nullable: true })
  description?: string

  @Field(type => [String])
  // We can use raw Extensions decorator if we want
  @Extensions({ log: { message: 'ingredients field accessed', level: 0 } })
  ingredients: string[]

  // this will override the object type log message
  @LogMessage('Ratings accessed')
  @Field(type => [Int])
  ratings: number[]

  @Field(type => Float, { nullable: true })
  get averageRating(): number | null {
    return this.ratings.reduce((a, b) => a + b, 0) / this.ratings.length
  }
}
