import { Resolver, Query } from '../../../src'

import User from './user'
import { users } from './data'

@Resolver(of => User)
export default class AccountsResolver {
  @Query(returns => User)
  me(): User {
    return users[0]
  }
}
