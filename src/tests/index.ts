// tslint:disable
import "reflect-metadata";

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
export class User {}
export type ContextType = {
  user: User;
};

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

@GraphQLResolver(Recipe)
// export class RecipeResolver implements Resolver<Recipe> {
export class RecipeResolver {
  // static test = true;

  constructor(public recipeRepository: Repository<Recipe>) {}

  @Query(returnType => Recipe, { nullable: true })
  recipe(@Args() { recipeId }: FindRecipeArgs) {
    return this.recipeRepository.findOneById(recipeId);
  }

  @Query(Recipe, { array: true })
  recipes(): Promise<Array<Recipe>> {
    return this.recipeRepository.find();
  }

  // @Authorized()
  @Mutation(Recipe)
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

MetadataStorage.build();
MetadataStorage.objectTypes.forEach(objectType => {
  console.log("Object:", objectType.name, objectType.fields);
});
MetadataStorage.inputTypes.forEach(inputType => {
  console.log("Input:", inputType.name, inputType.fields);
});
MetadataStorage.argumentTypes.forEach(argType => {
  console.log("Arg:", argType.name, argType.fields);
});
MetadataStorage.queries.forEach(query => {
  console.log("Query:", query.methodName, query.params);
});
MetadataStorage.mutations.forEach(mutation => {
  console.log("Mutation:", mutation.methodName, mutation.params);
});
MetadataStorage.fieldResolvers.forEach(resolver => {
  console.log("FieldResolver:", resolver.parentType!.name, resolver.methodName, resolver.params);
});

// const recipe: Recipe = {
//   id: "1",
//   description: "none",
//   averageRating: 0,
//   title: "hehe",
//   ratings: [
//     {
//       user: {},
//       value: 2,
//     },
//     {
//       user: {},
//       value: 4,
//     },
//   ],
// };

// const MyResolver: any = MetadataStorage.queries[0].target;
// const myResolver: RecipeResolver = new MyResolver();
// myResolver.recipeRepository = {
//   findOneById(id: string) {
//     return {
//       id,
//       name: "Test",
//     }
//   }
// } as any;

// const result = MetadataStorage.queries[0].handler.call(myResolver, { recipeId: 2 });
// console.log(result);
