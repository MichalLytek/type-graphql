import { Recipe } from "./recipe.type";

function createRecipe(recipeData: Partial<Recipe>) {
  return Object.assign(new Recipe(), recipeData);
}

export function createRecipeSamples() {
  return [
    createRecipe({
      title: "Recipe 1",
      description: "Desc 1",
      ratings: [0, 3, 1],
      creationDate: new Date("2018-04-11"),
    }),
    createRecipe({
      title: "Recipe 2",
      description: "Desc 2",
      ratings: [4, 2, 3, 1],
      creationDate: new Date("2018-04-15"),
    }),
    createRecipe({
      title: "Recipe 3",
      description: "Desc 3",
      ratings: [5, 4],
      creationDate: new Date(),
    }),
  ];
}
