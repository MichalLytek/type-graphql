import { Directive, Field, ObjectType } from "type-graphql";

@Directive("@extends")
@Directive(`@key(fields: "upc")`)
@ObjectType()
export class Product {
  @Directive("@external")
  @Field()
  upc!: string;
}
