import { ObjectType, Query, Mutation, Arg, Int, Resolver } from "type-graphql";

import PaginatedResponse from "./paginated-response.type";
import Recipe from "./recipe.type";
import createSampleRecipes from "./recipe.samples";

// we need to create a temporary class for the abstract, generic class "instance"
@ObjectType()
class RecipesResponse extends PaginatedResponse(Recipe) {
  // you can add more fields here if you need
}

@Resolver()
export default class RecipeResolver {
  private readonly recipes = createSampleRecipes();

  @Query({ name: "recipes" })
  getRecipes(
    @Arg("first", type => Int, { nullable: true, defaultValue: 10 }) first: number,
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
