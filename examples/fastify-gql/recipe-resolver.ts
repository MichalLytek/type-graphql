import { Resolver, Query } from "../../src";
import { Recipe } from "./recipe-type";

@Resolver(() => Recipe)
export class RecipeResolver {
  @Query()
  recipe(): Recipe {
    return {
      title: "Recipe 1",
      creationDate: new Date(),
    };
  }

  @Query(() => [Recipe])
  recipes(): Recipe[] {
    return [
      {
        title: "Recipe 1",
        creationDate: new Date(),
      },
      {
        title: "Recipe 2",
        creationDate: new Date(),
      },
    ];
  }
}
