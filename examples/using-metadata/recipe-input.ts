import { Recipe } from "./recipe-type";
import { InputType, Field, Metadata } from "../../src";

@Metadata({ classTest: "123" })
@InputType()
export class RecipeInput implements Partial<Recipe> {
  @Metadata({ test: "123" })
  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;
}
