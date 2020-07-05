import { Injectable } from "@graphql-modules/di";
import { Query, Resolver } from "../../../src";

import User from "./user.type";
import UserService from "./user.service";

@Injectable()
@Resolver(of => User)
export default class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(returns => [User])
  users() {
    return this.userService.getAll();
  }
}
