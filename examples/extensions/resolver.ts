import { Resolver, Query, Mutation, Arg, Extensions } from "../../src";
import { Logger } from "./logger.decorator";

import { Recipe } from "./recipe.type";
import { createRecipe, sampleRecipes } from "./recipe.helpers";

@Resolver()
export class ExampleResolver {
  private recipesData: Recipe[] = sampleRecipes.slice();

  @Extensions({ some: "data" })
  @Query(returns => [Recipe])
  async recipes(): Promise<Recipe[]> {
    return await this.recipesData;
  }

  @Mutation()
  addRecipe(
    @Arg("title") title: string,
    @Arg("description", { nullable: true }) description?: string,
  ): Recipe {
    const newRecipe = createRecipe({
      title,
      description,
      ratings: [],
    });
    this.recipesData.push(newRecipe);
    return newRecipe;
  }

  @Logger("This message will not be logged")
  @Logger("It will be overridden by this one")
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
