import { inventory } from "./data";
import { Product } from "./product";

export async function resolveProductReference(
  reference: Pick<Product, "upc">,
): Promise<Product | undefined> {
  const found = inventory.find(i => i.upc === reference.upc);

  if (!found) {
    return;
  }

  // eslint-disable-next-line consistent-return
  return Object.assign(new Product(), {
    ...reference,
    ...found,
  });
}
