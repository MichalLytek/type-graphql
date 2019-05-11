import { Resolver, Query } from "../../src";

import { Recipe } from "./recipe-type";
import { AuthGuard } from "./auth-guard.decorator";

@Resolver(of => Recipe)
export class RecipeResolver {
  private readonly recipe: Recipe = {
    description: "Desc 1",
    title: "Recipe 1",
    ratings: [0, 3, 1],
    creationDate: new Date("2018-04-11"),
  };

  @AuthGuard
  @Query(returns => Recipe, { name: "recipe", nullable: true })
  getRecipe(): Recipe {
    return this.recipe;
  }
}
