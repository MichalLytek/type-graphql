import { Inject, Service } from "typedi";
import { type RecipeInput } from "./recipe.input";
import { Recipe } from "./recipe.type";

// Service is global, shared by every request
@Service({ global: true })
export class RecipeService {
  private autoIncrementValue: number;

  constructor(@Inject("SAMPLE_RECIPES") private readonly items: Recipe[]) {
    console.log("RecipeService created!");
    this.autoIncrementValue = items.length;
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

  private createRecipe(recipeData: Partial<Recipe>): Recipe {
    const recipe = Object.assign(new Recipe(), {
      ...recipeData,
      id: this.getId(),
    });

    return recipe;
  }

  private getId(): string {
    this.autoIncrementValue += 1;

    return this.autoIncrementValue.toString();
  }
}
