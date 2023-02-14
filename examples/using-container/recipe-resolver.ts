import { Inject, Service } from "typedi";
import { Resolver, Query, FieldResolver, Arg, Root, Mutation } from "type-graphql";
import { Recipe } from "./recipe-type";
import { RecipeService } from "./recipe-service";
import { RecipeInput } from "./recipe-input";

@Service()
@Resolver(_of => Recipe)
export class RecipeResolver {
  // Inject service
  @Inject()
  private readonly recipeService!: RecipeService;

  @Query(_returns => Recipe, { nullable: true })
  async recipe(@Arg("recipeId") recipeId: string) {
    return this.recipeService.getOne(recipeId);
  }

  @Query(_returns => [Recipe])
  async recipes(): Promise<Recipe[]> {
    return this.recipeService.getAll();
  }

  @Mutation(_returns => Recipe)
  async addRecipe(@Arg("recipe") recipe: RecipeInput): Promise<Recipe> {
    return this.recipeService.add(recipe);
  }

  @FieldResolver()
  async numberInCollection(@Root() recipe: Recipe): Promise<number> {
    const index = await this.recipeService.findIndex(recipe);
    return index + 1;
  }
}
