import Joiful from "joiful";
import { InputType, Field } from "type-graphql";
import { Recipe } from "./recipe.type";

@InputType()
export class RecipeInput implements Partial<Recipe> {
  @Field()
  // Joi decorator
  @Joiful.string().required().max(30)
  title: string;

  @Field({ nullable: true })
  // Joi decorator
  @Joiful.string().min(30).max(255)
  description?: string;
}
