import { Arg, Query, Resolver } from "type-graphql";
import { sampleCooks } from "./cook.data";
import type { Cook } from "./cook.type";
import { Difficulty } from "./difficulty.enum";
import { sampleRecipes } from "./recipe.data";
import { Recipe } from "./recipe.type";
import { SearchResult } from "./search-result.union";

@Resolver()
export class ExampleResolver {
  private recipesData: Recipe[] = sampleRecipes;

  private cooks: Cook[] = sampleCooks;

  @Query(_returns => [Recipe])
  async recipes(
    @Arg("difficulty", _type => Difficulty, { nullable: true }) difficulty?: Difficulty,
  ): Promise<Recipe[]> {
    if (!difficulty) {
      return this.recipesData;
    }

    return this.recipesData.filter(recipe => recipe.preparationDifficulty === difficulty);
  }

  @Query(_returns => [SearchResult])
  async search(@Arg("cookName") cookName: string): Promise<(typeof SearchResult)[]> {
    const recipes = this.recipesData.filter(recipe => recipe.cook.name.match(cookName));
    const cooks = this.cooks.filter(cook => cook.name.match(cookName));

    return [...recipes, ...cooks];
  }
}
