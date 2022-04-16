import { Field, ID, ObjectType, Int, Float, UseMiddleware } from '../../../src'

import { LogAccessMiddleware } from '../middlewares/log-access'
import { NumberInterceptor } from '../middlewares/number-interceptor'

@ObjectType()
export class Recipe {
  @Field()
  title: string

  @Field({ nullable: true })
  description?: string

  @Field(type => [Int])
  @UseMiddleware(LogAccessMiddleware)
  ratings: number[]

  @Field(type => Float, { nullable: true })
  @UseMiddleware(NumberInterceptor(3))
  get averageRating(): number | null {
    const ratingsCount = this.ratings.length
    if (ratingsCount === 0) {
      return null
    }
    const ratingsSum = this.ratings.reduce((a, b) => a + b, 0)
    return ratingsSum / ratingsCount
  }
}
