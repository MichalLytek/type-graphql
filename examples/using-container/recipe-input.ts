import { Recipe } from "./recipe-type";
import { InputType, Field } from "type-graphql";

@InputType()
export class RecipeInput implements Partial<Recipe> {
  @Field({ nullable: true })
  description: string;

  @Field(type => [String])
  ingredients: string[];

  @Field()
  title: string;
}
