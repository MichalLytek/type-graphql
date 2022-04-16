import { Injectable } from '@graphql-modules/di'

import User from './user.type'
import createUsers from './user.seed'

@Injectable()
export default class UserService {
  private readonly users: User[] = createUsers()

  getAll() {
    return this.users
  }

  findById(id: number) {
    return this.users.find(it => it.id === id)
  }
}
