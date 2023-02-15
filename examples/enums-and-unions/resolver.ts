import { Resolver, Query, Arg } from "type-graphql";
import { Recipe } from "./recipe.type";
import { sampleRecipes } from "./recipe.data";
import { Difficulty } from "./difficulty.enum";
import { SearchResult } from "./search-result.union";
import { Cook } from "./cook.type";
import { sampleCooks } from "./cook.data";

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
  async search(@Arg("cookName") cookName: string): Promise<Array<typeof SearchResult>> {
    const recipes = this.recipesData.filter(recipe => recipe.cook.name.match(cookName));
    const cooks = this.cooks.filter(cook => cook.name.match(cookName));

    return [...recipes, ...cooks];
  }
}
