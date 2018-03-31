import { Resolver, Query, FieldResolver, Arg, Root, Mutation } from "../../../src/index";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";

import { Rate } from "../entities/rate";
import { User } from "../entities/user";

@Resolver(objectType => Rate)
export class RateResolver {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  @FieldResolver()
  async user(@Root() rate: Rate): Promise<User> {
    return (await this.userRepository.findOneById(rate.userId, { cache: 1000 }))!;
  }
}
