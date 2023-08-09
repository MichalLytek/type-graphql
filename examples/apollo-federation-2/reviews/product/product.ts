import { Directive, Field, ObjectType } from "type-graphql";

@Directive("@extends")
@Directive(`@key(fields: "upc")`)
@Directive("@interfaceObject")
@ObjectType()
export class Product {
  @Directive("@external")
  @Field()
  upc!: string;
}
