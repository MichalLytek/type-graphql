import { Directive, FieldResolver, Resolver, Root } from "type-graphql";
import { Product } from "./product";

@Resolver(_of => Product)
export class InventoryResolver {
  @Directive(`@requires(fields: "price weight")`)
  @FieldResolver(_returns => Number)
  async shippingEstimate(@Root() product: Product): Promise<number> {
    // free for expensive items
    if (product.price > 1000) {
      return 0;
    }

    // estimate is based on weight
    return product.weight * 0.5;
  }
}
