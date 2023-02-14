import { InputType, Field } from "type-graphql";
import { Recipe } from "./recipe.type";

@InputType()
export class RecipeInput implements Partial<Recipe> {
  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field(_type => [String])
  ingredients: string[];
}
