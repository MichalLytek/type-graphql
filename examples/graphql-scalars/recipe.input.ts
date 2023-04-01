import { GraphQLNonEmptyString } from "graphql-scalars";
import { Field, InputType } from "type-graphql";
import type { Recipe } from "./recipe.type";

@InputType()
export class RecipeInput implements Partial<Recipe> {
  @Field(_type => GraphQLNonEmptyString)
  title: string;

  @Field(_type => GraphQLNonEmptyString, { nullable: true })
  description?: string;
}
