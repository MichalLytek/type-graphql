import { Injectable } from '@graphql-modules/di'
import { Resolver, Query } from '../../../src'

import Recipe from './recipe.type'
import RecipeService from './recipe.service'

@Injectable()
@Resolver(of => Recipe)
export default class RecipeResolver {
  constructor(private readonly recipeService: RecipeService) {}

  @Query(returns => [Recipe])
  recipes() {
    return this.recipeService.getAll()
  }
}
