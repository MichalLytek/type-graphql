import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { AmendUserInput, CreateUserInput } from "./inputs";
import { User } from "./types";

@Resolver()
export class UserResolver {
  private autoIncrementId = 0;

  private readonly usersData: User[] = [];

  @Query(_returns => [User])
  async users(): Promise<User[]> {
    return this.usersData;
  }

  @Mutation(_returns => User)
  async createUser(@Arg("input") userData: CreateUserInput): Promise<User> {
    // Generate the ID and store the password
    this.autoIncrementId += 1;
    const user: User = { ...userData, id: this.autoIncrementId };
    this.usersData.push(user);
    return user;
  }

  @Mutation(_returns => User)
  async amendUser(@Arg("input") { id, ...userData }: AmendUserInput): Promise<User> {
    // Receive the ID but can't change the password
    const user = this.usersData.find(it => it.id === id);
    if (!user) {
      throw new Error(`Invalid ID: ${id}`);
    }
    Object.assign(user, userData);
    return user;
  }
}
