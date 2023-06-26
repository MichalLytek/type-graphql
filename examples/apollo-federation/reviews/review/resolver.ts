import { FieldResolver, Resolver } from "type-graphql";
import { reviews } from "./data";
import { Review } from "./review";

@Resolver(_of => Review)
export class ReviewsResolver {
  @FieldResolver(_returns => [Review])
  async reviews(): Promise<Review[]> {
    return reviews;
  }
}
