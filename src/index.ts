// tslint:disable
import "reflect-metadata";

import { Repository } from "typeorm";

import {
  GraphQLResolver,
  GraphQLType,
  Field,
  Query,
  Mutation,
  Arguments,
  Context,
  FieldResolver,
  Root,
  Authorized,
  GraphQLArgumentType,
  GraphQLInputType,
  Argument,
} from "./decorators";
import { Int, ID, Float } from "./scalars";
import { Resolver } from "./types";

// mocks
export class User {}
export type Context = {
  user: User;
};

@GraphQLType()
export class Rate {
  @Field(type => Int)
  value: number;

  @Field()
  date: Date;

  @Field()
  user: User;
}

@GraphQLType()
export class Recipe {
  @Field(type => ID)
  readonly id: string;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field(type => Rate)
  ratings: Rate[];

  @Field(type => Float)
  averageRating: number;
}

@GraphQLArgumentType()
export class FindRecipeParams {
  @Field(type => ID)
  recipeId: string;
}

@GraphQLInputType()
export class RateInput {
  @Field(type => ID)
  recipeId: string;

  @Field(type => Int)
  value: number;
}

@GraphQLResolver(Recipe)
export class RecipeResolver implements Resolver<Recipe> {
  constructor(
    private readonly recipeRepository: Repository<Recipe>,
  ){}

  @Query(returnType => Recipe, { nullable: true })
  recipe(@Arguments() { recipeId }: FindRecipeParams) {
    return this.recipeRepository.findOneById(recipeId);
  }

  @Query(Recipe, { array: true })
  recipes(): Promise<Array<Recipe>> {
    return this.recipeRepository.find();
  }

  @Authorized()
  @Mutation(Recipe)
  async rate(
    @Argument("rate") rateInput: RateInput,
    @Context() { user }: Context,
  ) {
    // find the document
    const recipe = await this.recipeRepository.findOneById(rateInput.recipeId);
    if (!recipe) {
      throw new Error("Invalid recipe ID");
    }

    // update the document
    recipe.ratings.push({
      date: new Date(),
      value: rateInput.value,
      user,
    });

    // and save it
    return this.recipeRepository.save(recipe);
  }

  @FieldResolver()
  averageRating(@Root() recipe: Recipe) {
    const ratingsCount = recipe.ratings.length;
    const ratingsSum = recipe.ratings
      .map(rating => rating.value)
      .reduce((a, b) => a + b, 0);

    return ratingsCount ? ratingsSum / ratingsCount : 0;
  }
}
