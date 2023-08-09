import { Recipe } from "./recipe.type";

function createRecipe(recipeData: Partial<Recipe>): Recipe {
  return Object.assign(new Recipe(), recipeData);
}

export function createRecipeSamples() {
  return [
    createRecipe({
      title: "Recipe 1",
      ratings: [0, 3, 1],
    }),
    createRecipe({
      title: "Recipe 2",
      ratings: [4, 2, 3, 1],
    }),
    createRecipe({
      title: "Recipe 3",
      ratings: [5, 4],
    }),
  ];
}
