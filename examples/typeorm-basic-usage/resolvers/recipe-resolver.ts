import {
  Resolver,
  Query,
  FieldResolver,
  Arg,
  Root,
  Mutation,
  Ctx,
  Int,
} from "../../../src/index";
import { Repository } from "typeorm";
import { OrmRepository } from "typeorm-typedi-extensions";

import { Recipe } from "../entities/recipe";
import { Rate } from "../entities/rate";
import { User } from "../entities/user";
import { RecipeInput } from "./types/recipe-input";
import { Context } from "../index";
import { RateInput } from "./types/rate-input";

@Resolver(objectType => Recipe)
export class RecipeResolver {
  constructor(
    @OrmRepository(Recipe)
    private readonly recipeRepository: Repository<Recipe>,
    @OrmRepository(Rate)
    private readonly ratingsRepository: Repository<Rate>,
    @OrmRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  @Query(returnType => Recipe, { nullable: true })
  recipe(@Arg("recipeId", type => Int) recipeId: number) {
    return this.recipeRepository.findOneById(recipeId);
  }

  @Query(returnType => [Recipe])
  recipes(): Promise<Recipe[]> {
    return this.recipeRepository.find();
  }

  @Mutation(returnType => Recipe)
  async addRecipe(
    @Arg("recipe") recipeInput: RecipeInput,
    @Ctx() { user }: Context,
  ): Promise<Recipe> {
    const recipe = this.recipeRepository.create({
      ...recipeInput,
      authorId: user.id,
    });
    return await this.recipeRepository.save(recipe);
  }

  @Mutation(() => Recipe)
  async rate(@Arg("rate") rateInput: RateInput, @Ctx() { user }: Context): Promise<Recipe> {
    // find the recipe
    const recipe = await this.recipeRepository.findOneById(rateInput.recipeId, {
      relations: ["ratings"],
    });
    if (!recipe) {
      throw new Error("Invalid recipe ID");
    }

    // set the new recipe rate
    const newRate = this.ratingsRepository.create({
      recipe,
      value: rateInput.value,
      user,
    });
    recipe.ratings.push(newRate);

    // update the recipe
    await this.recipeRepository.save(recipe);
    return recipe;
  }

  @FieldResolver()
  ratings(@Root() recipe: Recipe) {
    return this.ratingsRepository.find({
      cache: 1000,
      where: { recipeId: recipe.id },
    });
  }

  @FieldResolver()
  async author(@Root() recipe: Recipe): Promise<User> {
    return (await this.userRepository.findOneById(recipe.authorId, { cache: 1000 }))!;
  }
}
