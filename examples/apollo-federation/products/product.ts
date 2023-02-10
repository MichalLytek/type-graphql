import { ObjectType, Directive, Field } from "type-graphql";

@Directive(`@key(fields: "upc")`)
@ObjectType()
export default class Product {
  @Field()
  upc: string;

  @Field()
  name: string;

  @Field()
  price: number;

  @Field()
  weight: number;
}
