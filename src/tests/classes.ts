// tslint:disable
import { Repository } from "typeorm";

import { Int, ID, Float } from "../scalars";
import { Resolver } from "../types";
import { MetadataStorage } from "../metadata/metadata-storage";
import {
  Arg,
  Args,
  Authorized,
  Context,
  Field,
  FieldResolver,
  GraphQLResolver,
  GraphQLInputType,
  GraphQLObjectType,
  GraphQLArgumentType,
  Query,
  Root,
  Mutation,
} from "../decorators";

// mocks
export type ContextType = {
  user: User;
};

@GraphQLObjectType()
export class User {
  @Field()
  email: string;

  @Field(type => Recipe)
  recipes: Recipe[];
}

@GraphQLObjectType()
export class Rate {
  @Field(type => Int)
  value: number;

  // @Field()
  // date: Date;

  @Field()
  user: User;
}

@GraphQLObjectType()
export class Recipe {
  @Field(type => ID)
  readonly id: string;

  @Field()
  title: string;

  @Field() 
  description: string;

  @Field()
  get hello(): string {
    return "world";
  }

  @Field(type => Rate)
  ratings: Rate[];

  @Field(type => Int)
  private ratingsCount(
    @Arg("minRate", type => Int)
    minRate: number,
  ): number {
    return this.ratings.filter(rating => rating.value >= minRate).length;
  }

  @Field(type => Float, { nullable: true })
  private averageRating?: number | null;
}

@GraphQLArgumentType()
export class FindRecipeArgs {
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

@GraphQLResolver(() => Recipe)
// export class RecipeResolver implements Resolver<Recipe> {
export class RecipeResolver {
  // static test = true;

  constructor(public recipeRepository: Repository<Recipe>) {}

  @Query(returnType => Recipe, { nullable: true })
  recipe(@Args() { recipeId }: FindRecipeArgs) {
    return this.recipeRepository.findOneById(recipeId);
  }

  @Query(returnType => Recipe, { array: true })
  recipes(): Promise<Array<Recipe>> {
    return this.recipeRepository.find();
  }

  // @Authorized()
  @Mutation(() => Recipe)
  async rate(@Context() { user }: ContextType, @Arg("rate") rateInput: RateInput) {
    // find the document
    const recipe = await this.recipeRepository.findOneById(rateInput.recipeId);
    if (!recipe) {
      throw new Error("Invalid recipe ID");
    }

    // update the document
    recipe.ratings.push({
      // date: new Date(),
      value: rateInput.value,
      user,
    });

    // and save it
    return this.recipeRepository.save(recipe);
  }

  @FieldResolver(returnType => Float)
  averageRating(@Root() recipe: Recipe) {
    const ratingsCount = recipe.ratings.length;
    const ratingsSum = recipe.ratings.map(rating => rating.value).reduce((a, b) => a + b, 0);

    return ratingsCount ? ratingsSum / ratingsCount : 0;
  }
}
