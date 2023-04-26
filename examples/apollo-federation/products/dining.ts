import { Directive, Field, ObjectType } from "../../../src";
import Product from "./product";

@Directive(`@key(fields: "upc")`)
@ObjectType({ implements: Product })
export default class Dining extends Product {
  @Field()
  height: string;
}
