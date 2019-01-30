import {
  Resolver,
  Query,
  FieldResolver,
  Arg,
  Root,
  Mutation,
  Int,
  ResolverInterface,
  Args,
} from "../../src";
import { plainToClass } from "class-transformer";
import { Recipe } from "./recipe-type";
import { RecipeInput } from "./recipe-input";
import { createRecipeSamples } from "./recipe-samples";
import { WhereModel, WhereModelObject } from "./where-model";
import { HasModel } from "./has-model";

HasModel;

@Resolver(of => Recipe)
export class RecipeResolver implements ResolverInterface<Recipe> {
  private readonly items: Recipe[] = createRecipeSamples();

  @Query(returns => Recipe, { model: WhereModelObject })
  argsRecipe(@Args({ type: Recipe }) args: WhereModel<Recipe>): WhereModelObject<Recipe> {
    const recipe = new WhereModelObject<Recipe>();
    recipe.items = this.items;
    console.log(recipe);
    return recipe;
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
    @Arg("minRate", type => Int, { defaultValue: 0.0 }) minRate: number,
  ): number {
    return recipe.ratings.filter(rating => rating >= minRate).length;
  }
}
