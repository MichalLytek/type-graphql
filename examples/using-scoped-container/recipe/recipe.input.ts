import { Field, InputType } from "type-graphql";
import type { Recipe } from "./recipe.type";

@InputType()
export class RecipeInput implements Partial<Recipe> {
  @Field()
  title: string;

  @Field({ nullable: true })
  description: string;

  @Field(_type => [String])
  ingredients: string[];
}
