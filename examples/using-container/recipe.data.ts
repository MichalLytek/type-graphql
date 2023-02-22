import { Recipe } from "./recipe.type";

function createRecipe(recipeData: Partial<Recipe>): Recipe {
  return Object.assign(new Recipe(), recipeData);
}

export const sampleRecipes = [
  createRecipe({
    id: "1",
    title: "Recipe 1",
    description: "Desc 1",
    ingredients: ["one", "two", "three"],
  }),
  createRecipe({
    id: "2",
    title: "Recipe 2",
    description: "Desc 2",
    ingredients: ["four", "five", "six"],
  }),
  createRecipe({
    id: "3",
    title: "Recipe 3",
    ingredients: ["seven", "eight", "nine"],
  }),
];
