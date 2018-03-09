import { Recipe } from "./recipe-type";
import { GraphQLInputType, Field } from "../../src";

@GraphQLInputType()
export class RecipeInput implements Partial<Recipe> {
  @Field({ nullable: true })
  description: string;

  @Field(type => String)
  ingredients: string[];

  @Field()
  title: string;
}
