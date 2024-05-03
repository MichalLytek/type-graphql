import { Arg, Ctx, FieldResolver, Int, Mutation, Query, Resolver, Root } from "type-graphql";
import { RatingInput, RecipeInput } from "./types";
import { Context } from "../context.type";
import { Rating, Recipe, User } from "../entities";

@Resolver(_of => Recipe)
export class RecipeResolver {
  @Query(_returns => Recipe, { nullable: true })
  recipe(@Arg("recipeId", _type => Int) recipeId: number, @Ctx() { entityManager }: Context) {
    return entityManager.findOne(Recipe, recipeId);
  }

  @Query(_returns => [Recipe])
  recipes(@Ctx() { entityManager }: Context): Promise<Recipe[]> {
    return entityManager.find(Recipe, {});
  }

  @Mutation(_returns => Recipe)
  async addRecipe(
    @Arg("recipe") recipeInput: RecipeInput,
    @Ctx() { user, entityManager }: Context,
  ): Promise<Recipe> {
    const recipe = entityManager.create(Recipe, {
      title: recipeInput.title,
      description: recipeInput.description,
      author: entityManager.getReference(User, user.id),
    });
    await entityManager.persistAndFlush(recipe);
    return recipe;
  }

  @Mutation(_returns => Recipe)
  async rate(
    @Arg("rate") rateInput: RatingInput,
    @Ctx() { user, entityManager }: Context,
  ): Promise<Recipe> {
    // Find the recipe
    const recipe = await entityManager.findOne(Recipe, rateInput.recipeId, {
      populate: ["ratings"],
    });
    if (!recipe) {
      throw new Error("Invalid recipe ID");
    }

    // Set the new recipe rating
    const newRating = entityManager.create(Rating, {
      recipe,
      value: rateInput.value,
      user: entityManager.getReference(User, user.id),
    });
    recipe.ratings.add(newRating);

    // Update the recipe
    await entityManager.persistAndFlush(recipe);

    return recipe;
  }

  @FieldResolver()
  ratings(@Root() recipe: Recipe, @Ctx() { entityManager }: Context) {
    return entityManager.find(Rating, { recipe: { id: recipe.id } });
  }

  @FieldResolver()
  async author(@Root() recipe: Recipe, @Ctx() { entityManager }: Context): Promise<User> {
    return entityManager.findOneOrFail(User, recipe.author.id);
  }
}
