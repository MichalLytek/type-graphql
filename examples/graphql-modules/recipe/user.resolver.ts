import { Injectable } from "@graphql-modules/di";
import { Resolver, FieldResolver, Root } from "../../../src";

import User from "./user.type";
import RecipeService from "./recipe.service";

@Injectable()
@Resolver(of => User)
export default class UserResolver {
  constructor(private readonly recipeService: RecipeService) {}

  @FieldResolver()
  recipes(@Root() user: User) {
    return this.recipeService.findById(user.id);
  }
}
