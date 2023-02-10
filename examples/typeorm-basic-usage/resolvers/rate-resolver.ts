import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Resolver, FieldResolver, Root } from "type-graphql";

import { Rate } from "../entities/rate";
import { User } from "../entities/user";

@Resolver(of => Rate)
export class RateResolver {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  @FieldResolver()
  async user(@Root() rate: Rate): Promise<User> {
    return (await this.userRepository.findOne({ where: { id: rate.userId }, cache: 1000 }))!;
  }
}
