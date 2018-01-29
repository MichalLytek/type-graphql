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
import { plainToClass } from "class-transformer";

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
  private instanceValue = Math.random();
  private helloResponse = "World!";

  @Field(type => ID)
  readonly id: string;

  @Field()
  title: string;

  @Field() 
  description: string;

  @Field()
  get hello(): string {
    return this.helloResponse;
  }

  @Field(type => Rate)
  ratings: Rate[];

  @Field(type => Int)
  private ratingsCount(
    @Arg("minRate", type => Int)
    minRate: number = 0,
  ): number {
    // check if this (instance) is not shared between objects
    console.log("instanceValue", this.instanceValue);
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
  private helloStr = "Secret hello";
  private recipesData: Recipe[] = [
    plainToClass(Recipe, {
      id: 1,
      title: "Recipe 1",
      description: "Desc 2",
      ratings: [
        { user: null, value: 5},
        { user: null, value: 3},
        { user: null, value: 3},
      ],
    }),
    plainToClass(Recipe, {
      id: 2,
      title: "Recipe 2",
      description: "Desc",
      ratings: [
        { user: null, value: 5},
        { user: null, value: 1},
        { user: null, value: 4},
        { user: null, value: 2},
      ],
    })
  ];

  @Query(returnType => Recipe, { nullable: true })
  recipe(@Args() { recipeId }: FindRecipeArgs): Recipe | undefined {
    return this.recipesData.find(recipe => recipe.id == recipeId);
  }

  @Query(returnType => Recipe, { array: true })
  async recipes(): Promise<Array<Recipe>> {
    return this.recipesData;
  }

  @Query()
  hello(@Arg("name") name: string): string {
    return `${this.helloStr}, ${name}!`;
  }

  // @Authorized()
  @Mutation(() => Recipe)
  async rate(@Context() { user }: ContextType, @Arg("rate") rateInput: RateInput) {
    // find the document
    const recipe = await this.recipesData.find(recipe => recipe.id == rateInput.recipeId);
    if (!recipe) {
      throw new Error("Invalid recipe ID");
    }

    // update the document
    recipe.ratings.push({
      // date: new Date(),
      value: rateInput.value,
      user,
    });
  }

  @FieldResolver(returnType => Float)
  averageRating(@Root() recipe: Recipe) {
    const ratingsCount = recipe.ratings.length;
    const ratingsSum = recipe.ratings.map(rating => rating.value).reduce((a, b) => a + b, 0);

    return ratingsCount ? ratingsSum / ratingsCount : 0;
  }
}
