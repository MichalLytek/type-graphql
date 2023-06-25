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
  async user(@Root() rating: Rating): Promise<User> {
    return (await this.userRepository.findOne({ where: { id: rating.userId }, cache: 1000 }))!;
  }
}
