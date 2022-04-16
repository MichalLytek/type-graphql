import { Recipe } from './recipe.type'

export default [
  createRecipe({
    description: 'Desc 1',
    title: 'Recipe 1',
    ratings: [0, 3, 1]
  }),
  createRecipe({
    description: 'Desc 2',
    title: 'Recipe 2',
    ratings: [4, 2, 3, 1]
  }),
  createRecipe({
    description: 'Desc 3',
    title: 'Recipe 3',
    ratings: [4, 5, 3, 1, 5]
  })
]

function createRecipe(recipeData: Partial<Recipe>): Recipe {
  return Object.assign(new Recipe(), recipeData)
}
