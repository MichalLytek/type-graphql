import { plainToClass } from "class-transformer";
import { Service, Inject } from "typedi";

import { Recipe } from "./recipe-type";
import { RecipeInput } from "./recipe-input";

@Service()
export class RecipeService {
  private autoIncrementValue: number;

  constructor(@Inject("SAMPLE_RECIPES") private readonly items: Recipe[]) {
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
