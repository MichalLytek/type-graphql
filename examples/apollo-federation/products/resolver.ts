import { Resolver, Query, Arg } from "type-graphql";

import Product from "./product";
import { products } from "./data";

@Resolver(of => Product)
export default class ProductsResolver {
  @Query(returns => [Product])
  async topProducts(
    @Arg("first", { defaultValue: 5 })
    first: number,
  ): Promise<Product[]> {
    return products.slice(0, first);
  }
}
