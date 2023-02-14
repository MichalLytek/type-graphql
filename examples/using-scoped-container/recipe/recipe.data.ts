import Container from "typedi";
import { Recipe } from "./recipe.type";

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

function createRecipe(recipeData: Partial<Recipe>): Recipe {
  return Object.assign(new Recipe(), recipeData);
}

export function setSamplesInContainer() {
  // Sdd sample recipes to container
  Container.set({
    id: "SAMPLE_RECIPES",
    transient: true, // Create a fresh copy for each 'get' of samples
    factory: () => {
      console.log("sampleRecipes copy created!");
      return sampleRecipes.slice();
    },
  });
}
