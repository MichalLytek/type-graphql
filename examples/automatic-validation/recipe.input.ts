import { Length, MaxLength } from "class-validator";
import { Field, InputType } from "type-graphql";
import { type Recipe } from "./recipe.type";

@InputType()
export class RecipeInput implements Partial<Recipe> {
  @Field()
  @MaxLength(30)
  title!: string;

  @Field({ nullable: true })
  @Length(30, 255)
  description?: string;
}
