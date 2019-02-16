import Recipe from "./recipe.type";

export default function createSampleRecipes(): Recipe[] {
  return [
    {
      description: "Desc 1",
      title: "Recipe 1",
      ratings: [0, 3, 1],
    },
    {
      description: "Desc 2",
      title: "Recipe 2",
      ratings: [4, 2, 3, 1],
    },
    {
      description: "Desc 3",
      title: "Recipe 3",
      ratings: [5, 4],
    },
  ];
}
