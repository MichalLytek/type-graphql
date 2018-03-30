import { plainToClass } from "class-transformer";

import { Recipe } from "./recipe.type";
import { Comment } from "./comment.type";

export const sampleRecipes = [
  createRecipe({
    id: "1",
    title: "Recipe 1",
    description: "Desc 1",
    comments: createComments([
      {
        date: new Date("2018-03-21"),
        content: "Very tasty!",
        nickname: "Anonymous",
      },
      {
        date: new Date("2018-01-12"),
        content: "Not so tasty!",
        nickname: "Anonymous again",
      },
    ]),
  }),
  createRecipe({
    id: "2",
    title: "Recipe 2",
    description: "Desc 2",
    comments: createComments([
      {
        date: new Date(),
        content: "Very good, very cheap!",
        nickname: "Master of cooking",
      },
    ]),
  }),
  createRecipe({
    id: "3",
    title: "Recipe 3",
    comments: [],
  }),
];

function createRecipe(recipeData: Partial<Recipe>): Recipe {
  return plainToClass(Recipe, recipeData);
}

function createComments(commentData: Array<Partial<Comment>>): Comment[] {
  return plainToClass(Comment, commentData);
}
