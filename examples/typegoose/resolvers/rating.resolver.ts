import { FieldResolver, Resolver, Root } from "type-graphql";
import type { User } from "../entities";
import { Rating, UserModel } from "../entities";

@Resolver(_of => Rating)
export class RatingResolver {
  @FieldResolver()
  async user(@Root() rate: Rating): Promise<User> {
    return (await UserModel.findById(rate.user))!;
  }
}
