import { Args, Query, Resolver } from "type-graphql";
import { Service } from "typedi";
import { RecipesArgs } from "./recipe.args";
import { recipeSamples } from "./recipe.samples";
import { Recipe } from "./recipe.type";
import { CurrentUser } from "../decorators/current-user";
import { ValidateArgs } from "../decorators/validate-args";
import { User } from "../user";

@Service()
@Resolver(_of => Recipe)
export class RecipeResolver {
  private readonly items: Recipe[] = recipeSamples;

  @Query(_returns => [Recipe])
  @ValidateArgs(RecipesArgs)
  async recipes(
    @Args({ validate: false }) // disable built-in validation here
    options: RecipesArgs,
    @CurrentUser() currentUser: User,
  ): Promise<Recipe[]> {
    console.log(`User "${currentUser.name}" queried for recipes!`);
    const start = options.skip;
    const end = options.skip + options.take;
    return this.items.slice(start, end);
  }
}
