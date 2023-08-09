import { Query, Resolver } from "type-graphql";
import { users } from "./data";
import { User } from "./user";

@Resolver(_of => User)
export class AccountsResolver {
  @Query(_returns => User)
  me(): User {
    return users[0];
  }
}
