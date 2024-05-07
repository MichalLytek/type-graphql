import { Directive, Field, ID, ObjectType } from "type-graphql";
import { Product } from "../product";
import { User } from "../user";

@Directive(`@key(fields: "id")`)
@ObjectType()
export class Review {
  @Field(_type => ID)
  id!: string;

  @Field()
  body!: string;

  @Directive(`@provides(fields: "username")`)
  @Field()
  author!: User;

  @Field()
  product!: Product;
}
