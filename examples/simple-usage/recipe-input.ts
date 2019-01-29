import { Recipe } from "./recipe-type";
import { InputType, Field, ArgsType } from "../../src";

@InputType()
export class RecipeInput implements Partial<Recipe> {
  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;
}

@ArgsType()
export class RecipeArgs {
  @Field()
  test: string;
}
