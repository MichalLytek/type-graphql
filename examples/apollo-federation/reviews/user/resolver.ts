import { Resolver, FieldResolver, Root } from "type-graphql";

import User from "./user";
import Review from "../review/review";
import { reviews } from "../review/data";

@Resolver(of => User)
export default class UserReviewsResolver {
  @FieldResolver(returns => [Review])
  async reviews(@Root() user: User): Promise<Review[]> {
    return reviews.filter(review => review.author.id === user.id);
  }
}
