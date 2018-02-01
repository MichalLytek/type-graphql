import { plainToClass } from "class-transformer";
import { Service } from "typedi";

import { Recipe } from "./recipe-type";
import { RecipeInput } from "./recipe-input";

@Service()
export class RecipeService {
  private autoIncrementValue = 0;

  private items: Recipe[] = [
    this.createRecipe({
      title: "Recipe 1",
      description: "Desc 1",
      ingredients: [
        "one",
        "two",
        "three",
      ],
    }),
    this.createRecipe({
      title: "Recipe 2",
      description: "Desc 2",
      ingredients: [
        "four",
        "five",
        "six",
      ],
    }),
    this.createRecipe({
      title: "Recipe 3",
      ingredients: [
        "seven",
        "eight",
        "nine",
      ],
    }),
  ];

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
