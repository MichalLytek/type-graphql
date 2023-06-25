import { Ctx, FieldResolver, Resolver, Root } from "type-graphql";
import { Context } from "../context.type";
import { Rating, User } from "../entities";

@Resolver(_of => Rating)
export class RatingResolver {
  @FieldResolver()
  async user(@Root() rating: Rating, @Ctx() { entityManager }: Context): Promise<User> {
    return entityManager.findOneOrFail(User, rating.user.id);
  }
}
