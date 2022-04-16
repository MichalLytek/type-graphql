import { Directive, ObjectType, Field, ID } from '../../../../src'

import User from '../user/user'
import Product from '../product/product'

@Directive(`@key(fields: "id")`)
@ObjectType()
export default class Review {
  @Field(type => ID)
  id: string

  @Field()
  body: string

  @Directive(`@provides(fields: "username")`)
  @Field()
  author: User

  @Field()
  product: Product
}
