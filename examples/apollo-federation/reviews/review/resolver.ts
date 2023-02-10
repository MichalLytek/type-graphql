import { Resolver, FieldResolver } from "type-graphql";

import Review from "./review";
import { reviews } from "./data";

@Resolver(of => Review)
export default class ReviewsResolver {
  @FieldResolver(returns => [Review])
  async reviews(): Promise<Review[]> {
    return reviews;
  }
}
