import { Recipe } from "./recipe-type";

export function generateRecipes(count: number): Recipe[] {
  return Array.from(new Array(count), (_, i): Recipe => ({
    title: `Recipe #${i + 1}`,
    description: `Description #${i + 1}`,
    creationDate: new Date(),
  }));
}
