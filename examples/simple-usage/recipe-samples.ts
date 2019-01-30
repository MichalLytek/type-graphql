import { plainToClass } from "class-transformer";

import { Recipe } from "./recipe-type";

export function createRecipeSamples() {
  return plainToClass(Recipe, [
    {
      description: "Desc 1",
      title: "Recipe 1",
      ratings: [0, 3, 1],
      creationDate: new Date("2018-04-11"),
    },
    {
      description: "Desc 2",
      title: "Recipe 2",
      ratings: [4, 2, 3, 1],
      creationDate: new Date("2018-04-15"),
    },
    {
      description: "Desc 3",
      title: "Recipe 3",
      ratings: [5, 4],
      creationDate: new Date(),
    },
  ]);
}
