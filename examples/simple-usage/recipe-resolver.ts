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
import { Recipe, Test } from "./recipe-type";
import { RecipeInput } from "./recipe-input";
import { createRecipeSamples } from "./recipe-samples";
import { WhereModel, Where2Model } from "./where-model";

@Resolver(of => Recipe)
export class RecipeResolver implements ResolverInterface<Recipe> {
  private readonly items: Recipe[] = createRecipeSamples();

  // @Query(returns => Recipe, { nullable: true })
  // async argsRecipe(@Args({ type: Recipe }) args: WhereModel<Recipe>): Promise<Recipe> {
  //   return new Recipe();
  // }

  // @Query(returns => Test, { nullable: true })
  // async argsRecipe2(@Args({ type: Test }) args: WhereModel<Test>): Promise<Test> {
  //   return new Test();
  // }

  // @Query(returns => Recipe, { nullable: true })
  // async argsRecipe3(@Args() args: RecipeArgs): Promise<Recipe> {
  //   return new Recipe();
  // }

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
