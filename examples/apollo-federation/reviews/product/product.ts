import { ObjectType, Directive, Field } from "type-graphql";

@Directive("@extends")
@Directive(`@key(fields: "upc")`)
@ObjectType()
export default class Product {
  @Directive("@external")
  @Field()
  upc: string;
}
