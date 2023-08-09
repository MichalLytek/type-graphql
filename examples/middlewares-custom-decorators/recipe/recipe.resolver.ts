import { Args, Query, Resolver } from "type-graphql";
import { Service } from "typedi";
import { RecipesArgs } from "./recipe.args";
import { recipes as recipesData } from "./recipe.data";
import { Recipe } from "./recipe.type";
import { CurrentUser, ValidateArgs } from "../decorators";
import { User } from "../user.type";

@Service()
@Resolver(_of => Recipe)
export class RecipeResolver {
  private readonly items: Recipe[] = recipesData;

  @Query(_returns => [Recipe])
  @ValidateArgs(RecipesArgs)
  async recipes(
    @Args({ validate: false }) // Disable built-in validation here
    options: RecipesArgs,
    @CurrentUser() currentUser: User,
  ): Promise<Recipe[]> {
    console.log(`User "${currentUser.name}" queried for recipes!`);
    const start = options.skip;
    const end = options.skip + options.take;
    return this.items.slice(start, end);
  }
}
