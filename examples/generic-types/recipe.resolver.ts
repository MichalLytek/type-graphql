/* eslint-disable max-classes-per-file */
import { Arg, Int, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import { PaginatedResponse } from "./paginated-response.type";
import { createSampleRecipes } from "./recipe.data";
import { Recipe } from "./recipe.type";

// Create a temporary class for the abstract generic class 'instance'
@ObjectType()
class RecipesResponse extends PaginatedResponse(Recipe) {
  // Add more fields here if needed
}

@Resolver()
export class RecipeResolver {
  private readonly recipes = createSampleRecipes();

  @Query({ name: "recipes" })
  getRecipes(
    @Arg("first", _type => Int, { nullable: true, defaultValue: 10 }) first: number,
  ): RecipesResponse {
    const total = this.recipes.length;
    return {
      items: this.recipes.slice(0, first),
      hasMore: total > first,
      total,
    };
  }

  @Mutation()
  addSampleRecipe(): Recipe {
    const recipe: Recipe = {
      title: "Sample recipe",
      description: "Sample description",
      ratings: [1, 2, 3, 4],
    };
    this.recipes.push(recipe);
    return recipe;
  }
}
