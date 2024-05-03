import { Directive, Field, ObjectType } from "type-graphql";

@ObjectType()
@Directive("@extends")
@Directive("@interfaceObject")
@Directive(`@key(fields: "upc")`)
export class Product {
  @Field()
  @Directive("@external")
  upc!: string;

  @Field()
  @Directive("@external")
  weight!: number;

  @Field()
  @Directive("@external")
  price!: number;

  @Field()
  inStock!: boolean;
}
