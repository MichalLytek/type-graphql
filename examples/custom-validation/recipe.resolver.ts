import { Arg, Args, Mutation, Query, Resolver } from "type-graphql";
import { generateRecipes } from "./helpers";
import { RecipeInput } from "./recipe.input";
import { Recipe } from "./recipe.type";
import { RecipesArguments } from "./recipes.arguments";

@Resolver(_of => Recipe)
export class RecipeResolver {
  private readonly items: Recipe[] = generateRecipes(100);

  @Query(_returns => [Recipe])
  async recipes(@Args() options: RecipesArguments): Promise<Recipe[]> {
    const start: number = options.skip;
    const end: number = options.skip + options.take;
    return this.items.slice(start, end);
  }

  @Mutation(_returns => Recipe)
  async addRecipe(@Arg("input") recipeInput: RecipeInput): Promise<Recipe> {
    const recipe = new Recipe();
    recipe.description = recipeInput.description;
    recipe.title = recipeInput.title;
    recipe.creationDate = new Date();

    await this.items.push(recipe);
    return recipe;
  }
}
