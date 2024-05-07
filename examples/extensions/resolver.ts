import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Service } from "typedi";
import { LogMessage } from "./log-message.decorator";
import { sampleRecipes } from "./recipe.data";
import { Recipe } from "./recipe.type";

@Service()
@Resolver()
export class RecipeResolver {
  private recipesData: Recipe[] = sampleRecipes.slice();

  @Query(_returns => [Recipe])
  async recipes(): Promise<Recipe[]> {
    return this.recipesData;
  }

  @Mutation()
  addRecipe(
    @Arg("title") title: string,
    @Arg("description", { nullable: true }) description?: string,
  ): Recipe {
    const newRecipe = Object.assign(new Recipe(), {
      title,
      description,
      ratings: [],
    });
    this.recipesData.push(newRecipe);
    return newRecipe;
  }

  @LogMessage("Recipe deletion requested")
  @Mutation()
  deleteRecipe(@Arg("title") title: string): boolean {
    const foundRecipeIndex = this.recipesData.findIndex(it => it.title === title);
    if (!foundRecipeIndex) {
      return false;
    }
    this.recipesData.splice(foundRecipeIndex, 1);
    return true;
  }
}
