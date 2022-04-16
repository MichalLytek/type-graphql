import { Field, ObjectType } from '../../../src'

import User from './user.type'

@ObjectType()
export default class Recipe {
  authorId: number

  @Field()
  author: User
}
