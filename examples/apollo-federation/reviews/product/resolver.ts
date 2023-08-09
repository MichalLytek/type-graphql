import { FieldResolver, Resolver, Root } from "type-graphql";
import { Product } from "./product";
import { Review, reviews } from "../review";

@Resolver(_of => Product)
export class ProductReviewsResolver {
  @FieldResolver(() => [Review])
  async reviews(@Root() product: Product): Promise<Review[]> {
    return reviews.filter(review => review.product.upc === product.upc);
  }
}
