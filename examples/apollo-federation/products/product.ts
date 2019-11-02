import { ObjectType, Directive, Field } from "../../../src";

import { products } from "./data";

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

export async function resolveProductReference(
  reference: Pick<Product, "upc">,
): Promise<Product | undefined> {
  return products.find(p => p.upc === reference.upc);
}
