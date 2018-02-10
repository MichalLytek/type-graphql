import { MaxLength, Length } from "class-validator";
import { GraphQLInputType, Field } from "../../src";

import { Recipe } from "./recipe-type";

@GraphQLInputType()
export class RecipeInput implements Partial<Recipe> {
  @Field()
  @MaxLength(30)
  title: string;

  @Field({ nullable: true })
  @Length(30, 255)
  description?: string;
}
