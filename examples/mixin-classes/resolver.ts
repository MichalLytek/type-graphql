import { Resolver, Mutation, Arg, Query } from "type-graphql";

import CreateUserInput from "./inputs/create-user";
import AmendUserInput from "./inputs/amend-user";
import User from "./types/user";

@Resolver()
export default class UserResolver {
  private autoIncrementId = 0;

  private readonly usersData: User[] = [];

  @Query(returns => [User])
  async users(): Promise<User[]> {
    return this.usersData;
  }

  @Mutation(returns => User)
  async createUser(@Arg("input") userData: CreateUserInput): Promise<User> {
    // in createUser we generate the ID and store the password
    const user: User = { ...userData, id: ++this.autoIncrementId };
    this.usersData.push(user);
    return user;
  }

  @Mutation(returns => User)
  async amendUser(@Arg("input") { id, ...userData }: AmendUserInput): Promise<User> {
    // in amendUser we use receive the ID but can't change the password
    const user = this.usersData.find(it => it.id === id);
    if (!user) {
      throw new Error(`Invalid ID: ${id}`);
    }
    Object.assign(user, userData);
    return user;
  }
}
