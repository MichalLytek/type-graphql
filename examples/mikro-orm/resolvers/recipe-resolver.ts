import { Resolver, Query, FieldResolver, Arg, Root, Mutation, Ctx, Int } from '../../../src'

import { Recipe } from '../entities/recipe'
import { Rate } from '../entities/rate'
import { User } from '../entities/user'
import { RecipeInput } from './inputs/recipe-input'
import { RateInput } from './inputs/rate-input'
import { ContextType } from '../types'

@Resolver(of => Recipe)
export class RecipeResolver {
  @Query(returns => Recipe, { nullable: true })
  async recipe(@Arg('recipeId', type => Int) recipeId: number, @Ctx() { entityManager }: ContextType) {
    return entityManager.findOne(Recipe, recipeId)
  }

  @Query(returns => [Recipe])
  async recipes(@Ctx() { entityManager }: ContextType): Promise<Recipe[]> {
    return entityManager.find(Recipe, {})
  }

  @Mutation(returns => Recipe)
  async addRecipe(
    @Arg('recipe') recipeInput: RecipeInput,
    @Ctx() { user, entityManager }: ContextType
  ): Promise<Recipe> {
    const recipe = entityManager.create(Recipe, {
      title: recipeInput.title,
      description: recipeInput.description,
      author: entityManager.getReference(User, user.id)
    })
    await entityManager.persistAndFlush(recipe)
    return recipe
  }

  @Mutation(returns => Recipe)
  async rate(@Arg('rate') rateInput: RateInput, @Ctx() { user, entityManager }: ContextType): Promise<Recipe> {
    // find the recipe
    const recipe = await entityManager.findOne(Recipe, rateInput.recipeId, {
      populate: ['ratings']
    })
    if (!recipe) {
      throw new Error('Invalid recipe ID')
    }

    // set the new recipe rate
    const newRate = entityManager.create(Rate, {
      recipe,
      value: rateInput.value,
      user: entityManager.getReference(User, user.id)
    })
    recipe.ratings.add(newRate)

    // update the recipe
    await entityManager.persistAndFlush(recipe)
    return recipe
  }

  @FieldResolver()
  async ratings(@Root() recipe: Recipe, @Ctx() { entityManager }: ContextType) {
    return entityManager.find(Rate, { recipe: { id: recipe.id } })
  }

  @FieldResolver()
  async author(@Root() recipe: Recipe, @Ctx() { entityManager }: ContextType): Promise<User> {
    return entityManager.findOneOrFail(User, recipe.author.id)
  }
}
