import { InputType, Field } from "../../../../src";

import { Recipe } from "../../entities/recipe";

@InputType()
export class RecipeInput implements Partial<Recipe> {
  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;
}
