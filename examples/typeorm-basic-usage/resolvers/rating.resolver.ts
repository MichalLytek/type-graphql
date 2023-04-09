import { FieldResolver, Resolver, Root } from "type-graphql";
import type { Repository } from "typeorm";
import { dataSource } from "../datasource";
import { Rating, User } from "../entities";

@Resolver(_of => Rating)
export class RatingResolver {
  private readonly userRepository: Repository<User>;

  constructor() {
    this.userRepository = dataSource.getRepository(User);
  }

  @FieldResolver()
  async user(@Root() rate: Rating): Promise<User> {
    return (await this.userRepository.findOne({ where: { id: rate.userId }, cache: 1000 }))!;
  }
}
