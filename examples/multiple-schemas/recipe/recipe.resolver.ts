import { Resolver, FieldResolver, Root } from "../../../src";

import { ResourceResolver } from "../resource/resource.resolver";
import { Recipe } from "./recipe.type";

const recipes: Recipe[] = [
  {
    id: 1,
    title: "Recipe 1",
    ratings: [1, 3, 4],
  },
];

@Resolver(of => Recipe)
export class RecipeResolver extends ResourceResolver(Recipe, recipes) {
  // here you can add resource-specific operations

  @FieldResolver()
  averageRating(@Root() recipe: Recipe): number {
    return recipe.ratings.reduce((a, b) => a + b, 0) / recipe.ratings.length;
  }
}
