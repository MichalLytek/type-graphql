import { GraphQLResolver, Query, Authorized, Mutation, Arg } from "../../src";

import { Recipe } from "./recipe.type";
import { sampleRecipes } from "./sample-recipes";

@GraphQLResolver()
export class Resolver {
  private recipesData: Recipe[] = sampleRecipes;

  // anyone can read recipes collection
  @Query(returnType => [Recipe])
  async recipes(): Promise<Recipe[]> {
    return this.recipesData;
  }

  @Authorized() // only logged users can add new recipe
  @Mutation()
  addRecipe(
    @Arg("title")
    title: string,
    @Arg("description", { nullable: true })
    description?: string,
  ): Recipe {
    const newRecipe = new Recipe();
    newRecipe.title = title;
    newRecipe.description = description;
    newRecipe.ratings = [];
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
