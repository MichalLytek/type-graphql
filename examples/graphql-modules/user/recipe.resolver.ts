import { Injectable } from '@graphql-modules/di'
import { Resolver, FieldResolver, Root } from '../../../src'

import UserService from './user.service'
import Recipe from './recipe.type'
import User from './user.type'

@Injectable()
@Resolver(of => Recipe)
export default class RecipeResolver {
  constructor(private readonly userService: UserService) {}

  @FieldResolver()
  author(@Root() recipe: Recipe): User | undefined {
    return this.userService.findById(recipe.authorId)
  }
}
