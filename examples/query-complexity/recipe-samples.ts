import { plainToClass } from "class-transformer";

import { Recipe } from "./recipe-type";

export function createRecipeSamples() {
  return plainToClass(Recipe, [
    {
      title: "Recipe 1",
      ratings: [0, 3, 1],
    },
    {
      title: "Recipe 2",
      ratings: [4, 2, 3, 1],
    },
    {
      title: "Recipe 3",
      ratings: [5, 4],
    },
  ]);
}
