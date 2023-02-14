import { Resolver, Query, Authorized, Mutation, Arg } from "type-graphql";
import { Recipe } from "./recipe.type";
import { sampleRecipes } from "./recipe.data";

@Resolver()
export class RecipeResolver {
  private recipesData: Recipe[] = sampleRecipes.slice();

  // Anyone can read recipes collection
  @Query(_returns => [Recipe])
  async recipes(): Promise<Recipe[]> {
    return this.recipesData;
  }

  @Authorized() // Only authenticated users can add new recipe
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

  @Authorized("ADMIN") // Only 'ADMIN' users can remove published recipe
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
