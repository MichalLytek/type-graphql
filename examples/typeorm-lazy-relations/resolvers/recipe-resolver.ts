import {
  Resolver,
  Query,
  FieldResolver,
  Arg,
  Root,
  Mutation,
  Ctx,
  Int,
} from "../../../src/";
import { Repository } from "typeorm";
import { OrmRepository } from "typeorm-typedi-extensions";

import { Recipe } from "../entities/recipe";
import { Rate } from "../entities/rate";
import { User } from "../entities/user";
import { RecipeInput } from "./types/recipe-input";
import { RateInput } from "./types/rate-input";
import { Context } from "./types/context";

@Resolver(Recipe)
export class RecipeResolver {
  constructor(
    @OrmRepository(Recipe) private readonly recipeRepository: Repository<Recipe>,
    @OrmRepository(Rate) private readonly ratingsRepository: Repository<Rate>,
  ) {}

  @Query(returnType => Recipe, { nullable: true })
  recipe(
    @Arg("recipeId", type => Int)
    recipeId: number,
  ) {
    return this.recipeRepository.findOneById(recipeId);
  }

  @Query(returnType => [Recipe])
  recipes(): Promise<Recipe[]> {
    return this.recipeRepository.find();
  }

  @Mutation(returnType => Recipe)
  addRecipe(@Arg("recipe") recipeInput: RecipeInput, @Ctx() { user }: Context): Promise<Recipe> {
    const recipe = this.recipeRepository.create({
      ...recipeInput,
      author: user,
    });
    return this.recipeRepository.save(recipe);
  }

  @Mutation(returnType => Recipe)
  async rate(@Ctx() { user }: Context, @Arg("rate") rateInput: RateInput): Promise<Recipe> {
    // find the recipe
    const recipe = await this.recipeRepository.findOneById(rateInput.recipeId, {
      relations: ["ratings"], // preload the relation as we will modify it
    });
    if (!recipe) {
      throw new Error("Invalid recipe ID");
    }

    // add the new recipe rate
    (await recipe.ratings).push(
      this.ratingsRepository.create({
        recipe,
        user,
        value: rateInput.value,
      }),
    );

    // return updated recipe
    return await this.recipeRepository.save(recipe);
  }
}
