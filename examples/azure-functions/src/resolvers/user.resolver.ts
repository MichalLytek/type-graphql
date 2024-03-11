import { Mutation, Query, Resolver } from "type-graphql";
import { Service } from "typedi";
import { sampleUser } from "../constants/sample-data";
import { User } from "../models/user";

@Service()
@Resolver(() => User)
export class UserResolver {
  @Query(() => [User])
  public async findManyUsers(): Promise<User[]> {
    return [sampleUser];
  }

  @Query(() => User)
  public async findOneUser(): Promise<User> {
    return sampleUser;
  }

  @Mutation(() => User)
  public async updateUser(): Promise<User> {
    return sampleUser;
  }

  @Mutation(() => User)
  public async createUser(): Promise<User> {
    return sampleUser;
  }
}
