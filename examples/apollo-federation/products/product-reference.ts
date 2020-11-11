import { products } from "./data";
import Product from "./product";

export async function resolveProductReference(
  reference: Pick<Product, "upc">,
): Promise<Product | undefined> {
  return products.find(p => p.upc === reference.upc);
}
