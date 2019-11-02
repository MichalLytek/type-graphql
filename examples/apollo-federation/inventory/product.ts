import { ObjectType, Directive, Field } from "../../../src";

import { inventory } from "./data";
import { plainToClass } from "class-transformer";

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

export async function resolveProductReference(
  reference: Pick<Product, "upc">,
): Promise<Product | undefined> {
  const found = inventory.find(i => i.upc === reference.upc);

  if (!found) {
    return;
  }

  return plainToClass(Product, {
    ...reference,
    ...found,
  });
}
