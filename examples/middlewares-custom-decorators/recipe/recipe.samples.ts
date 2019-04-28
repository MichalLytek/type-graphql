import { plainToClass } from "class-transformer";

import { Recipe } from "./recipe.type";

export default plainToClass(Recipe, [
  {
    description: "Desc 1",
    title: "Recipe 1",
    ratings: [0, 3, 1],
  },
  {
    description: "Desc 2",
    title: "Recipe 2",
    ratings: [4, 2, 3, 1],
  },
  {
    description: "Desc 3",
    title: "Recipe 3",
    ratings: [4, 5, 3, 1, 5],
  },
]);
