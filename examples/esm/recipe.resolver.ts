import type { ResolverInterface } from "type-graphql";
import { Arg, FieldResolver, Int, Mutation, Query, Resolver, Root } from "type-graphql";
import { createRecipeSamples } from "./recipe.data.js";
import { RecipeInput } from "./recipe.input.js";
import { Recipe } from "./recipe.type.js";

@Resolver(_of => Recipe)
export class RecipeResolver implements ResolverInterface<Recipe> {
  private readonly items: Recipe[] = createRecipeSamples();

  @Query(_returns => Recipe, { nullable: true })
  async recipe(@Arg("title") title: string): Promise<Recipe | undefined> {
    return this.items.find(recipe => recipe.title === title);
  }

  @Query(_returns => [Recipe], { description: "Get all the recipes from around the world " })
  async recipes(): Promise<Recipe[]> {
    return this.items;
  }

  @Mutation(_returns => Recipe)
  async addRecipe(@Arg("recipe") recipeInput: RecipeInput): Promise<Recipe> {
    const recipe = Object.assign(new Recipe(), {
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
    @Arg("minRate", _type => Int, { defaultValue: 0 }) minRate: number,
  ): number {
    return recipe.ratings.filter(rating => rating >= minRate).length;
  }
}
