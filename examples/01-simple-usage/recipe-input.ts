import { Recipe } from "./recipe-type";
import { GraphQLInputType, Field } from "../../src";

@GraphQLInputType()
export class RecipeInput implements Partial<Recipe> {
  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;
}
