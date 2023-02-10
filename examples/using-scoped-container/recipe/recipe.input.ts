import { InputType, Field } from "type-graphql";

import { Recipe } from "./recipe.type";

@InputType()
export class RecipeInput implements Partial<Recipe> {
  @Field({ nullable: true })
  description: string;

  @Field(type => [String])
  ingredients: string[];

  @Field()
  title: string;
}
