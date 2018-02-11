import { plainToClass } from "class-transformer";

import { Recipe } from "./classes";

export function createRecipe(data: Partial<Recipe>): Recipe {
  const recipe = plainToClass(Recipe, data);
  delete (recipe as any).instanceValue;
  return recipe;
}
