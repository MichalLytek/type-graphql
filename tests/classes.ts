// tslint:disable:member-ordering
import { Repository } from "typeorm";
import { plainToClass } from "class-transformer";

import {
  Int,
  ID,
  Float,
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
  Resolver,
} from "../src";
import { createRecipe } from "./helpers";

// mocks
export interface ContextType {
  user: User;
}

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

@GraphQLArgumentType()
export class RecipeTestArgs {
  @Field(type => Int, { nullable: true })
  length?: number = 255;
}

@GraphQLObjectType()
export class Recipe {
  private instanceValue = Math.random();
  private helloResponse = "World!";

  // tslint:disable-next-line:member-ordering
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

  @Field()
  private test(@Args() args: RecipeTestArgs): boolean {
    console.log("test length:", args.length);
    return true;
  }

  @Field(type => Int)
  private ratingsCount(
    @Arg("minRate", type => Float, { nullable: true })
    minRate: number = 0.0,
  ): number {
    // check if this (instance) is not shared between objects
    console.log("instanceValue", this.instanceValue, this.id);
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
    createRecipe({
      id: "1",
      title: "Recipe 1",
      description: "Desc 1",
      ratings: [
        { user: null as any, value: 5 },
        { user: null as any, value: 3 },
        { user: null as any, value: 3 },
      ],
    }),
    createRecipe({
      id: "2",
      title: "Recipe 2",
      description: "Desc 2",
      ratings: [
        { user: null as any, value: 5 },
        { user: null as any, value: 1 },
        { user: null as any, value: 4 },
        { user: null as any, value: 2 },
      ],
    }),
  ];

  @Query(returnType => Recipe, { nullable: true })
  recipe(@Args() { recipeId }: FindRecipeArgs): Recipe | undefined {
    return this.recipesData.find(recipe => recipe.id === recipeId);
  }

  @Query(returnType => Recipe, { array: true })
  async recipes(): Promise<Recipe[]> {
    return this.recipesData;
  }

  @Query()
  helloToYou(@Arg("name") name: string): string {
    return `${this.helloStr}, ${name}!`;
  }

  // @Authorized()
  @Mutation(() => Recipe)
  async rate(@Context() { user }: ContextType, @Arg("rate") rateInput: RateInput): Promise<Recipe> {
    // find the document
    const recipe = await this.recipesData.find(data => data.id === rateInput.recipeId);
    if (!recipe) {
      throw new Error("Invalid recipe ID");
    }

    // update the document
    recipe.ratings.push({
      // date: new Date(),
      value: rateInput.value,
      user,
    });

    return recipe;
  }

  @FieldResolver()
  averageRating(
    @Root() recipe: Recipe,
    @Arg("optionalArg", { nullable: true }) optionalArg: boolean = false,
  ) {
    console.log("optionalArg", optionalArg);
    const ratingsCount = recipe.ratings.length;
    const ratingsSum = recipe.ratings.map(rating => rating.value).reduce((a, b) => a + b, 0);

    return ratingsCount ? ratingsSum / ratingsCount : 0;
  }
}
