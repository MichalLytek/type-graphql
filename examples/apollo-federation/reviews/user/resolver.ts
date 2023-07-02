import { FieldResolver, Resolver, Root } from "type-graphql";
import { User } from "./user";
// eslint-disable-next-line import/no-cycle
import { Review, reviews } from "../review";

@Resolver(_of => User)
export class UserReviewsResolver {
  @FieldResolver(_returns => [Review])
  async reviews(@Root() user: User): Promise<Review[]> {
    return reviews.filter(review => review.author.id === user.id);
  }
}
