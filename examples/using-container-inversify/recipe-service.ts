import { Recipe } from "./recipe-type";
import { RecipeInput } from "./recipe-input";

export interface RecipeService {
  getAll(): Promise<Recipe[]>;

  getOne(id: string): Promise<Recipe | undefined>;

  add(data: RecipeInput): Promise<Recipe>;

  findIndex(recipe: Recipe): Promise<number>;
}
