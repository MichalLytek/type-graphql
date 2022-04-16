import { Resolver, Query, Args } from '../../../src'

import recipeSamples from './recipe.samples'
import { Recipe } from './recipe.type'
import { RecipesArgs } from './recipe.args'
import { ValidateArgs } from '../decorators/validate-args'
import CurrentUser from '../decorators/current-user'
import User from '../user'

@Resolver(of => Recipe)
export class RecipeResolver {
  private readonly items: Recipe[] = recipeSamples

  @Query(returns => [Recipe])
  @ValidateArgs(RecipesArgs)
  async recipes(
    @Args({ validate: false }) // disable built-in validation here
    options: RecipesArgs,
    @CurrentUser() currentUser: User
  ): Promise<Recipe[]> {
    console.log(`User "${currentUser.name}" queried for recipes!`)
    const start = options.skip
    const end = options.skip + options.take
    return await this.items.slice(start, end)
  }
}
