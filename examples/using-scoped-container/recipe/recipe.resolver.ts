import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Inject, Service } from "typedi";
import { RecipeInput } from "./recipe.input";
import { RecipeService } from "./recipe.service";
import { Recipe } from "./recipe.type";
import { Context } from "../context.type";
import { Logger } from "../logger";

const delay = (time: number) =>
  new Promise(resolve => {
    setTimeout(resolve, time);
  });

// Resolver is recreated for each request (scoped)
@Service()
@Resolver(_of => Recipe)
export class RecipeResolver {
  constructor(
    @Inject()
    private readonly recipeService: RecipeService,
    @Inject()
    private readonly logger: Logger,
  ) {
    console.log("RecipeResolver created!");
  }

  @Query(_returns => Recipe, { nullable: true })
  async recipe(@Arg("recipeId") recipeId: string, @Ctx() { requestId }: Context) {
    const recipe = await this.recipeService.getOne(recipeId);
    if (!recipe) {
      console.log("request ID:", requestId); // Same requestId of logger
      this.logger.log(`Recipe ${recipeId} not found!`);
    }

    return recipe;
  }

  @Query(_returns => [Recipe])
  async recipes(): Promise<Recipe[]> {
    await delay(5000); // Simulate delay to allow for manual concurrent requests
    return this.recipeService.getAll();
  }

  @Mutation(_returns => Recipe)
  async addRecipe(@Arg("recipe") recipe: RecipeInput): Promise<Recipe> {
    return this.recipeService.add(recipe);
  }
}
