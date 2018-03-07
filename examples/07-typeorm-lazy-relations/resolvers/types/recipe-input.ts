import { GraphQLInputType, Field } from "../../../../src";

import { Recipe } from "../../entities/recipe";

@GraphQLInputType()
export class RecipeInput implements Partial<Recipe> {
  @Field()
  title: string;

  @Field({ nullable: true })
  description: string;
}
