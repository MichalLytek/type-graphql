import { Inject, Service } from "typedi";
import type { RecipeInput } from "./recipe.input";
import { Recipe } from "./recipe.type";

@Service()
export class RecipeService {
  private autoIncrementValue: number;

  constructor(
    @Inject("SAMPLE_RECIPES")
    private readonly items: Recipe[],
  ) {
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
    const recipe = Object.assign(new Recipe(), recipeData);
    recipe.id = this.getId();

    return recipe;
  }

  private getId(): string {
    this.autoIncrementValue += 1;

    return this.autoIncrementValue.toString();
  }
}
