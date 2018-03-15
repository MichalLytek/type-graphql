import { Resolver, Query, Arg } from "../../src";

import { Recipe } from "./recipe.type";
import { sampleRecipes } from "./recipe.samples";
import { Difficulty } from "./difficulty.enum";
import { SearchResult } from "./search-result.union";
import { Cook } from "./cook.type";
import { sampleCooks } from "./cook.samples";

@Resolver()
export class ExampleResolver {
  private recipesData: Recipe[] = sampleRecipes;
  private cooks: Cook[] = sampleCooks;

  @Query(returnType => [Recipe])
  async recipes(
    @Arg("difficulty", type => Difficulty, { nullable: true })
    difficulty?: Difficulty,
  ): Promise<Recipe[]> {
    if (!difficulty) {
      return this.recipesData;
    }

    return this.recipesData.filter(recipe => recipe.preparationDifficulty === difficulty);
  }

  @Query(returnType => [SearchResult])
  async search(@Arg("cookName") cookName: string): Promise<Array<typeof SearchResult>> {
    const recipes = this.recipesData.filter(recipe => recipe.cook.name.match(cookName));
    const cooks = this.cooks.filter(cook => cook.name.match(cookName));

    return [...recipes, ...cooks];
  }
}
