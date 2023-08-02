import { Types } from "mongoose";
import { Arg, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from "type-graphql";
import { RatingInput, RecipeInput } from "./types";
import { Context } from "../context.type";
import { type Rating, Recipe, RecipeModel, type User, UserModel } from "../entities";
import { ObjectIdScalar } from "../object-id.scalar";

@Resolver(_of => Recipe)
export class RecipeResolver {
  @Query(_returns => Recipe, { nullable: true })
  recipe(@Arg("recipeId", () => ObjectIdScalar) recipeId: Types.ObjectId) {
    return RecipeModel.findById(recipeId);
  }

  @Query(_returns => [Recipe])
  async recipes(): Promise<Recipe[]> {
    return RecipeModel.find({});
  }

  @Mutation(_returns => Recipe)
  async addRecipe(
    @Arg("recipe") recipeInput: RecipeInput,
    @Ctx() { user }: Context,
  ): Promise<Recipe> {
    const recipe = new RecipeModel({
      ...recipeInput,
      author: user.id,
    });

    await recipe.save();

    return recipe;
  }

  @Mutation(_returns => Recipe)
  async rating(@Arg("rating") ratingInput: RatingInput, @Ctx() { user }: Context): Promise<Recipe> {
    // Find the recipe
    const recipe = await RecipeModel.findById(ratingInput.recipeId);
    if (!recipe) {
      throw new Error("Invalid recipe ID");
    }

    // Set the new recipe rating
    const newRating: Rating = {
      value: ratingInput.value,
      user: user.id,
      date: new Date(),
    };

    // Add and update the new recipe
    recipe.ratings.push(newRating);
    await recipe.save();

    return recipe;
  }

  @FieldResolver()
  async author(@Root() recipe: Recipe): Promise<User> {
    return (await UserModel.findById(recipe.author))!;
  }
}
