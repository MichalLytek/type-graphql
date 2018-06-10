import { Resolver, Query, Args, UseMiddleware } from "../../../src";

import recipeSamples from "./recipe.samples";
import { Recipe } from "./recipe.type";
import { RecipesArgs } from "./recipe.args";
import { ValidateArgs } from "../decorators/validate-args";

@Resolver(of => Recipe)
export class RecipeResolver {
  private readonly items: Recipe[] = recipeSamples;

  @Query(returns => [Recipe])
  @ValidateArgs(RecipesArgs)
  async recipes(
    @Args({ validate: false }) // disable built-in validation here
    options: RecipesArgs,
  ): Promise<Recipe[]> {
    const start = options.skip;
    const end = options.skip + options.take;
    return await this.items.slice(start, end);
  }
}
