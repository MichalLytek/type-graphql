import { FieldResolver, Resolver, Root } from "type-graphql";
import type { User } from "../entities";
import { Rating, UserModel } from "../entities";

@Resolver(_of => Rating)
export class RatingResolver {
  @FieldResolver()
  async user(@Root() rating: Rating): Promise<User> {
    return (await UserModel.findById(rating.user))!;
  }
}
