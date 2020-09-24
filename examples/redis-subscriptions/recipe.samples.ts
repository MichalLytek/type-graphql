import { Recipe } from "./recipe.type";
import { Comment } from "./comment.type";

export const sampleRecipes = [
  createRecipe({
    id: "1",
    title: "Recipe 1",
    description: "Desc 1",
    comments: [
      createComment({
        date: new Date("2018-03-21"),
        content: "Very tasty!",
        nickname: "Anonymous",
      }),
      createComment({
        date: new Date("2018-01-12"),
        content: "Not so tasty!",
        nickname: "Anonymous again",
      }),
    ],
  }),
  createRecipe({
    id: "2",
    title: "Recipe 2",
    description: "Desc 2",
    comments: [
      createComment({
        date: new Date(),
        content: "Very good, very cheap!",
        nickname: "Master of cooking",
      }),
    ],
  }),
  createRecipe({
    id: "3",
    title: "Recipe 3",
    comments: [],
  }),
];

function createRecipe(recipeData: Partial<Recipe>): Recipe {
  return Object.assign(new Recipe(), recipeData);
}

function createComment(commentData: Partial<Comment>): Comment {
  return Object.assign(new Comment(), commentData);
}
