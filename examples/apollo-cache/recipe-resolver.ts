import { Resolver, Query, Arg } from "../../src";

import { Recipe } from "./recipe-type";
import { createRecipeSamples } from "./recipe-samples";
import { CacheControl } from "./cache-control";
import { getTime } from "./utils";

@Resolver(of => Recipe)
export class RecipeResolver {
  private readonly items: Recipe[] = createRecipeSamples();

  @Query(returns => Recipe, { nullable: true })
  async recipe(@Arg("title") title: string): Promise<Recipe | undefined> {
    console.log(`Called 'recipe' with title '${title}' on ${getTime()}`);
    return await this.items.find(recipe => recipe.title === title);
  }

  @Query(returns => Recipe, { nullable: true })
  // here we declare that we want to cache the query for 60s
  @CacheControl({ maxAge: 60 })
  async cachedRecipe(@Arg("title") title: string): Promise<Recipe | undefined> {
    console.log(`Called 'cachedRecipe' with title '${title}' on ${getTime()}`);
    return await this.items.find(recipe => recipe.title === title);
  }

  @Query(returns => [Recipe])
  async recipes(): Promise<Recipe[]> {
    return await this.items;
  }
}
