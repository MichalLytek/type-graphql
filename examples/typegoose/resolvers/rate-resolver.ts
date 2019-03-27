import { Resolver, FieldResolver, Root } from "../../../src";

import { Rate } from "../entities/rate";
import { User, UserModel } from "../entities/user";

@Resolver(of => Rate)
export class RateResolver {
  @FieldResolver()
  async user(@Root() rate: Rate): Promise<User> {
    return (await UserModel.findById(rate.user))!;
  }
}
