import { Arg, Ctx, FieldResolver, Int, Mutation, Query, Resolver, Root } from "type-graphql";
import type { Repository } from "typeorm";
import { RatingInput, RecipeInput } from "./types";
import { Context } from "../context.type";
import { dataSource } from "../datasource";
import { Rating, Recipe, User } from "../entities";

@Resolver(_of => Recipe)
export class RecipeResolver {
  private readonly ratingRepository: Repository<Rating>;

  private readonly recipeRepository: Repository<Recipe>;

  private readonly userRepository: Repository<User>;

  constructor() {
    this.ratingRepository = dataSource.getRepository(Rating);
    this.recipeRepository = dataSource.getRepository(Recipe);
    this.userRepository = dataSource.getRepository(User);
  }

  @Query(_returns => Recipe, { nullable: true })
  recipe(@Arg("recipeId", _type => Int) recipeId: number) {
    return this.recipeRepository.findOneBy({ id: recipeId });
  }

  @Query(_returns => [Recipe])
  recipes(): Promise<Recipe[]> {
    return this.recipeRepository.find();
  }

  @Mutation(_returns => Recipe)
  async addRecipe(
    @Arg("recipe") recipeInput: RecipeInput,
    @Ctx() { user }: Context,
  ): Promise<Recipe> {
    const recipe = this.recipeRepository.create({
      ...recipeInput,
      authorId: user.id,
    });
    return this.recipeRepository.save(recipe);
  }

  @Mutation(_returns => Recipe)
  async rating(@Arg("rating") ratingInput: RatingInput, @Ctx() { user }: Context): Promise<Recipe> {
    // Find the recipe
    const recipe = await this.recipeRepository.findOne({
      where: { id: ratingInput.recipeId },
      relations: ["ratings"],
    });
    if (!recipe) {
      throw new Error("Invalid recipe ID");
    }

    // Set the new recipe rating
    const newRating = this.ratingRepository.create({
      recipe,
      value: ratingInput.value,
      user,
    });

    recipe.ratings.push(newRating);

    // Update and return recipe
    return this.recipeRepository.save(recipe);
  }

  @FieldResolver()
  ratings(@Root() recipe: Recipe) {
    return this.ratingRepository.find({
      cache: 1000,
      where: { recipe: { id: recipe.id } },
    });
  }

  @FieldResolver()
  async author(@Root() recipe: Recipe): Promise<User> {
    return (await this.userRepository.findOne({ where: { id: recipe.authorId }, cache: 1000 }))!;
  }
}
