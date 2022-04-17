import { Injectable } from '@graphql-modules/di'

import User from './user.type'
import createUsers from './user.seed'

@Injectable()
export default class UserService {
  private readonly users: User[] = createUsers()

  getAll(): User[] {
    return this.users
  }

  findById(id: number): User | undefined {
    return this.users.find(it => it.id === id)
  }
}
