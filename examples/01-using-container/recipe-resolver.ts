import { GraphQLResolver, Query, FieldResolver, Arg, Root, Mutation } from "../../src/index";

import { Recipe } from "./recipe-type";
import { RecipeService } from "./recipe-service";
import { RecipeInput } from "./recipe-input";

@GraphQLResolver(() => Recipe)
export class RecipeResolver {
  constructor(
    // constructor injection of service
    private readonly recipeService: RecipeService,
  ) {}

  @Query(returnType => Recipe, { nullable: true })
  async recipe(@Arg("recipeId") recipeId: string) {
    return this.recipeService.getOne(recipeId);
  }

  @Query(returnType => Recipe, { array: true })
  async recipes(): Promise<Recipe[]> {
    return this.recipeService.getAll();
  }

  @Mutation(() => Recipe)
  async addRecipe(@Arg("recipe") recipe: RecipeInput): Promise<Recipe> {
    return this.recipeService.add(recipe);
  }

  @FieldResolver()
  async numberInCollection(@Root() recipe: Recipe): Promise<number> {
    const index = await this.recipeService.findIndex(recipe);
    return index + 1;
  }
}
