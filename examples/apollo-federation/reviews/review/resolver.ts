import { FieldResolver, Resolver } from "type-graphql";
// eslint-disable-next-line import/no-cycle
import { reviews } from "./data";
import { Review } from "./review";

@Resolver(_of => Review)
export class ReviewsResolver {
  @FieldResolver(_returns => [Review])
  async reviews(): Promise<Review[]> {
    return reviews;
  }
}
