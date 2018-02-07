import {
  GraphQLResolver,
  Query,
  FieldResolver,
  Arg,
  Root,
  Mutation,
  Float,
  Int,
} from "../../src/index";

import { Recipe } from "./recipe-type";
import { RecipeInput } from "./recipe-input";

@GraphQLResolver(() => Recipe)
export class RecipeResolver {
  private readonly items: Recipe[];
  constructor() {
    const recipe1 = new Recipe();
    recipe1.description = "Desc 1";
    recipe1.title = "Recipe 1";
    recipe1.ratings = [0, 3, 1];
    recipe1.created = new Date();
    const recipe2 = new Recipe();
    recipe2.description = "Desc 2";
    recipe2.title = "Recipe 2";
    recipe2.ratings = [4, 2, 3, 1];
    recipe2.created = new Date();
    this.items = [recipe1, recipe2];
  }

  @Query(returnType => Recipe, { nullable: true })
  async recipe(@Arg("title") title: string): Promise<Recipe | undefined> {
    return await this.items.find(recipe => recipe.title === title);
  }

  @Query(returnType => Recipe, { array: true })
  async recipes(): Promise<Recipe[]> {
    return await this.items;
  }

  @Mutation(() => Recipe)
  async addRecipe(@Arg("recipe") recipeInput: RecipeInput): Promise<Recipe> {
    const recipe = new Recipe();
    recipe.description = recipeInput.description;
    recipe.title = recipeInput.title;
    recipe.ratings = [];
    recipe.created = new Date();
    await this.items.push(recipe);
    return recipe;
  }

  @FieldResolver()
  // implement the private field resolver with args
  ratingsCount(
    @Root() recipe: Recipe,
    @Arg("minRate", type => Int, { nullable: true })
    minRate: number = 0.0,
  ): number {
    return recipe.ratings.filter(rating => rating >= minRate).length;
  }
}
