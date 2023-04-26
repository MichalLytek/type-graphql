import { Directive, Field, InterfaceType } from "../../../src";

@Directive(`@key(fields: "upc")`)
@InterfaceType()
export default abstract class Product {
  @Field()
  upc: string;

  @Field()
  name: string;

  @Field()
  price: number;

  @Field()
  weight: number;
}
