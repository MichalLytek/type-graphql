import { GraphQLResolver, Query, FieldResolver, Arg, Root, Mutation } from "../../../src/index";
import { Repository } from "typeorm";
import { OrmRepository } from "typeorm-typedi-extensions";

import { Recipe } from "../entities/recipe";
import { Rate } from "../entities/rate";
import { User } from "../entities/user";
import { RecipeInput } from "./types/recipe-input";

@GraphQLResolver(() => Recipe)
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
  recipe(@Arg("recipeId") recipeId: number) {
    return this.recipeRepository.findOneById(recipeId);
  }

  @Query(returnType => Recipe, { array: true })
  recipes(): Promise<Recipe[]> {
    return this.recipeRepository.find();
  }

  @Mutation(returnType => Recipe)
  addRecipe(@Arg("recipe") recipeInput: RecipeInput): Promise<Recipe> {
    const recipe = this.recipeRepository.create({
      ...recipeInput,
      authorId: 1,
    });
    return this.recipeRepository.save(recipe);
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
