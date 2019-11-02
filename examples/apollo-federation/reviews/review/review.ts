import { Type } from "class-transformer";
import { Directive, ObjectType, Field, ID } from "../../../../src";

import User from "../user/user";
import Product from "../product/product";

@Directive(`@key(fields: "id")`)
@ObjectType()
export default class Review {
  @Field(type => ID)
  id: string;

  @Field()
  body: string;

  @Type(() => User)
  @Directive(`@provides(fields: "username")`)
  @Field()
  author: User;

  @Type(() => Product)
  @Field()
  product: Product;
}
