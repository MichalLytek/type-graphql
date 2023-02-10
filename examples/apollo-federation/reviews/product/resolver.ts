import { Resolver, FieldResolver, Root } from "type-graphql";

import Product from "./product";
import { reviews } from "../review/data";
import Review from "../review/review";

@Resolver(of => Product)
export default class ProductReviewsResolver {
  @FieldResolver(() => [Review])
  async reviews(@Root() product: Product): Promise<Review[]> {
    return reviews.filter(review => review.product.upc === product.upc);
  }
}
