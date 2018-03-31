import { Resolver, Query, Authorized, Mutation, Arg } from "../../src";

import { Recipe } from "./recipe.type";
import { createRecipe, sampleRecipes } from "./recipe.helpers";

@Resolver()
export class ExampleResolver {
  private recipesData: Recipe[] = sampleRecipes.slice();

  // anyone can read recipes collection
  @Query(returns => [Recipe])
  async recipes(): Promise<Recipe[]> {
    return await this.recipesData;
  }

  @Authorized() // only logged users can add new recipe
  @Mutation()
  addRecipe(
    @Arg("title")
    title: string,
    @Arg("description", { nullable: true })
    description?: string,
  ): Recipe {
    const newRecipe = createRecipe({
      title,
      description,
      ratings: [],
    });
    this.recipesData.push(newRecipe);
    return newRecipe;
  }

  @Authorized("ADMIN") // only admin can remove the published recipe
  @Mutation()
  deleteRecipe(@Arg("title") title: string): boolean {
    const foundRecipeIndex = this.recipesData.findIndex(it => it.title === title);
    if (!foundRecipeIndex) {
      return false;
    }
    this.recipesData.splice(foundRecipeIndex, 1);
    return true;
  }
}
