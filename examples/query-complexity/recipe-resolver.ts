import { Resolver, Query, FieldResolver, Arg, Root, Int, ResolverInterface } from "../../src";

import { Recipe } from "./recipe-type";
import { createRecipeSamples } from "./recipe-samples";

@Resolver(of => Recipe)
export class RecipeResolver implements ResolverInterface<Recipe> {
  private readonly items: Recipe[] = createRecipeSamples();

  @Query(returns => [Recipe], { description: "Get all the recipes from around the world " })
  async recipes(): Promise<Recipe[]> {
    return await this.items;
  }
  /* Complexity in field resolver overrides complexity of equivalent field type*/
  @FieldResolver({ complexity: 10 })
  ratingsCount(
    @Root() recipe: Recipe,
    @Arg("minRate", type => Int, { nullable: true }) minRate: number = 0.0,
  ): number {
    return recipe.ratings.filter(rating => rating >= minRate).length;
  }
}
