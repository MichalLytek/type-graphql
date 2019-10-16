import { plainToClass } from "class-transformer";
import { inject, injectable } from "inversify";

import { RecipeService } from "./recipe-service";
import { Recipe } from "./recipe-type";
import { RecipeInput } from "./recipe-input";
import { TYPES } from "./types";

@injectable()
export class RecipeServiceImpl implements RecipeService {
  private autoIncrementValue: number;

  constructor(@inject(TYPES.SampleRecipes) private items: Recipe[]) {
    this.autoIncrementValue = this.items.length;
  }

  async getAll() {
    return this.items;
  }

  async getOne(id: string) {
    return this.items.find(it => it.id === id);
  }

  async add(data: RecipeInput) {
    const recipe = this.createRecipe(data);
    this.items.push(recipe);
    return recipe;
  }

  async findIndex(recipe: Recipe) {
    return this.items.findIndex(it => it.id === recipe.id);
  }

  private createRecipe(recipeData: Partial<Recipe>): Recipe {
    const recipe = plainToClass(Recipe, recipeData);
    recipe.id = this.getId();
    return recipe;
  }

  private getId(): string {
    return (++this.autoIncrementValue).toString();
  }
}
