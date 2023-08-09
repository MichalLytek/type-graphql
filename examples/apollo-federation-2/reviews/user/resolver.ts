import { FieldResolver, Resolver, Root } from "type-graphql";
import { User } from "./user";
import { reviews } from "../review/data";
import { Review } from "../review/review";

@Resolver(_of => User)
export class UserReviewsResolver {
  @FieldResolver(_returns => [Review])
  async reviews(@Root() user: User): Promise<Review[]> {
    return reviews.filter(review => review.author.id === user.id);
  }
}
