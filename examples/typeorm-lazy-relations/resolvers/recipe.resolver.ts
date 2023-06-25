import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import type { Repository } from "typeorm";
import { RatingInput, RecipeInput } from "./types";
import { Context } from "../context.type";
import { dataSource } from "../datasource";
import { Rating, Recipe } from "../entities";

@Resolver(Recipe)
export class RecipeResolver {
  private readonly ratingRepository: Repository<Rating>;

  private readonly recipeRepository: Repository<Recipe>;

  constructor() {
    this.ratingRepository = dataSource.getRepository(Rating);
    this.recipeRepository = dataSource.getRepository(Recipe);
  }

  @Query(_returns => Recipe, { nullable: true })
  recipe(@Arg("recipeId", _type => Int) recipeId: number) {
    return this.recipeRepository.findOneBy({ id: recipeId });
  }

  @Query(_returns => [Recipe])
  recipes(): Promise<Recipe[]> {
    return this.recipeRepository.find();
  }

  @Mutation(_returns => Recipe)
  addRecipe(@Arg("recipe") recipeInput: RecipeInput, @Ctx() { user }: Context): Promise<Recipe> {
    const recipe = this.recipeRepository.create({
      ...recipeInput,
      author: user,
    });
    return this.recipeRepository.save(recipe);
  }

  @Mutation(_returns => Recipe)
  async rating(@Ctx() { user }: Context, @Arg("rating") rateInput: RatingInput): Promise<Recipe> {
    // Find the recipe
    const recipe = await this.recipeRepository.findOne({
      where: { id: rateInput.recipeId },
      relations: ["ratings"],
    });
    if (!recipe) {
      throw new Error("Invalid recipe ID");
    }

    // Set the new recipe rating
    const newRating = this.ratingRepository.create({
      recipe,
      user,
      value: rateInput.value,
    });

    // Add the new recipe rating
    (await recipe.ratings).push(newRating);

    // Update and return recipe
    return this.recipeRepository.save(recipe);
  }
}
