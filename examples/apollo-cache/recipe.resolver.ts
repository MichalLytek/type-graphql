import { Resolver, Query, Arg } from "type-graphql";
import { Recipe } from "./recipe.type";
import { createRecipeSamples } from "./recipe.data";
import { CacheControl } from "./cache-control";
import { getTime } from "./helpers/getTime";

@Resolver(_of => Recipe)
export class RecipeResolver {
  private readonly items: Recipe[] = createRecipeSamples();

  @Query(_returns => Recipe, { nullable: true })
  async recipe(@Arg("title") title: string): Promise<Recipe | undefined> {
    console.log(`Called 'recipe' with title '${title}' on ${getTime()}`);
    return this.items.find(recipe => recipe.title === title);
  }

  @Query(_returns => Recipe, { nullable: true })
  // Cache query for 60s
  @CacheControl({ maxAge: 60 })
  async cachedRecipe(@Arg("title") title: string): Promise<Recipe | undefined> {
    console.log(`Called 'cachedRecipe' with title '${title}' on ${getTime()}`);
    return this.items.find(recipe => recipe.title === title);
  }

  @Query(_returns => [Recipe])
  async recipes(): Promise<Recipe[]> {
    return this.items;
  }
}
