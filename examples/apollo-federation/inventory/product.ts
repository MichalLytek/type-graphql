import { ObjectType, Directive, Field } from "type-graphql";

@ObjectType()
@Directive("@extends")
@Directive(`@key(fields: "upc")`)
export default class Product {
  @Field()
  @Directive("@external")
  upc: string;

  @Field()
  @Directive("@external")
  weight: number;

  @Field()
  @Directive("@external")
  price: number;

  @Field()
  inStock: boolean;
}
