import {
  Resolver,
  Query,
  FieldResolver,
  Arg,
  Root,
  Mutation,
  Float,
  Int,
  ResolverInterface,
} from "../../src";
import { plainToClass } from "class-transformer";

import { Recipe } from "./recipe-type";
import { RecipeInput } from "./recipe-input";

@Resolver(objectType => Recipe)
export class RecipeResolver implements ResolverInterface<Recipe> {
  private readonly items: Recipe[];
  constructor() {
    const recipe1 = plainToClass(Recipe, {
      description: "Desc 1",
      title: "Recipe 1",
      ratings: [0, 3, 1],
      creationDate: new Date(),
    });
    const recipe2 = plainToClass(Recipe, {
      description: "Desc 2",
      title: "Recipe 2",
      ratings: [4, 2, 3, 1],
      creationDate: new Date(),
    });
    this.items = [recipe1, recipe2];
  }

  @Query(returns => Recipe, { nullable: true })
  async recipe(@Arg("title") title: string): Promise<Recipe | undefined> {
    return await this.items.find(recipe => recipe.title === title);
  }

  @Query(returns => [Recipe], { description: "Get all the recipes from around the world " })
  async recipes(): Promise<Recipe[]> {
    return await this.items;
  }

  @Mutation(returns => Recipe)
  async addRecipe(@Arg("recipe") recipeInput: RecipeInput): Promise<Recipe> {
    const recipe = plainToClass(Recipe, {
      description: recipeInput.description,
      title: recipeInput.title,
      ratings: [],
      creationDate: new Date(),
    });
    await this.items.push(recipe);
    return recipe;
  }

  @FieldResolver()
  ratingsCount(
    @Root() recipe: Recipe,
    @Arg("minRate", type => Int, { nullable: true })
    minRate: number = 0.0,
  ): number {
    return recipe.ratings.filter(rating => rating >= minRate).length;
  }
}
