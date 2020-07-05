import { Injectable } from "@graphql-modules/di";

import Recipe from "./recipe.type";
import createRecipes from "./recipe.seed";

@Injectable()
export default class RecipeService {
  private readonly recipes: Recipe[] = createRecipes();

  getAll() {
    return this.recipes;
  }

  findById(id: number) {
    return this.recipes.filter(it => it.authorId === id);
  }
}
