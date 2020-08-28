import { Resolver, FieldResolver, Root, Ctx } from "../../../src";

import { Rate } from "../entities/rate";
import { User } from "../entities/user";
import { ContextType } from "../types";

@Resolver(of => Rate)
export class RateResolver {
  @FieldResolver()
  async user(@Root() rate: Rate, @Ctx() { entityManager }: ContextType): Promise<User> {
    return entityManager.findOneOrFail(User, rate.user.id);
  }
}
