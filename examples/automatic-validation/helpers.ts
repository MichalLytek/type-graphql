import { type Recipe } from "./recipe.type";

export function generateRecipes(count: number): Recipe[] {
  return new Array(count).fill(null).map(
    (_, i): Recipe => ({
      title: `Recipe #${i + 1}`,
      description: `Description #${i + 1}`,
      creationDate: new Date(),
    }),
  );
}
