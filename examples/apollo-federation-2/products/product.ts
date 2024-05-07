import { Directive, Field, InterfaceType } from "type-graphql";

@Directive(`@key(fields: "upc")`)
@InterfaceType()
export abstract class Product {
  @Field()
  upc!: string;

  @Field()
  name!: string;

  @Field()
  price!: number;

  @Field()
  weight!: number;
}
