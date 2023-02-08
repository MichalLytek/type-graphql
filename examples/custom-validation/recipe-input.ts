import * as Joiful from "joiful";
import { InputType, Field } from "../../src";

import { Recipe } from "./recipe-type";

@InputType()
export class RecipeInput implements Partial<Recipe> {
  @Field()
  // use decorators for Joi
  @Joiful.string().required().max(30)
  title: string;

  @Field({ nullable: true })
  // use decorators for Joi
  @Joiful.string().min(30).max(255)
  description?: string;
}
