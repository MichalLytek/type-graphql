import {
  Resolver,
  Query,
  Arg,
  Mutation,
  Args,
} from "../../src";

import { Recipe } from "./recipe-type";
import { RecipeInput } from "./recipe-input";
import { RecipesArguments } from "./recipes-arguments";
import { generateRecipes } from "./helpers";

@Resolver(objectType => Recipe)
export class RecipeResolver {
  private readonly items: Recipe[] = generateRecipes(100);

  @Query(returns => [Recipe])
  async recipes(@Args() options: RecipesArguments): Promise<Recipe[]> {
    const start: number = options.skip;
    const end: number = options.skip + options.take;
    return await this.items.slice(start, end);
  }

  @Mutation(returns => Recipe)
  async addRecipe(@Arg("input") recipeInput: RecipeInput): Promise<Recipe> {
    const recipe = new Recipe();
    recipe.description = recipeInput.description;
    recipe.title = recipeInput.title;
    recipe.creationDate = new Date();

    await this.items.push(recipe);
    return recipe;
  }
}
