import { plainToClass } from "class-transformer";

import { Recipe } from "./recipe.type";

export function createRecipe(recipeData: Partial<Recipe>): Recipe {
  return plainToClass(Recipe, recipeData);
}

export const sampleRecipes = [
  createRecipe({
    title: "Recipe 1",
    description: "Desc 1",
    ingredients: ["one", "two", "three"],
    ratings: [3, 4, 5, 5, 5],
  }),
  createRecipe({
    title: "Recipe 2",
    description: "Desc 2",
    ingredients: ["four", "five", "six"],
    ratings: [3, 4, 5, 3, 2],
  }),
  createRecipe({
    title: "Recipe 3",
    ingredients: ["seven", "eight", "nine"],
    ratings: [4, 4, 5, 5, 4],
  }),
];
