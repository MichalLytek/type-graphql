import { Directive, Field, ObjectType } from "type-graphql";
import { Product } from "./product";

@Directive(`@key(fields: "upc")`)
@ObjectType({ implements: Product })
export class Dining extends Product {
  @Field()
  height!: string;
}
