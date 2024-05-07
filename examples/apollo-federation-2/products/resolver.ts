import { Arg, Query, Resolver } from "type-graphql";
import { products } from "./data";
import { Product } from "./product";

@Resolver(_of => Product)
export class ProductsResolver {
  @Query(_returns => [Product])
  async topProducts(
    @Arg("first", { defaultValue: 5 })
    first: number,
  ): Promise<Product[]> {
    return products.slice(0, first);
  }
}
