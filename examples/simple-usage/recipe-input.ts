import { Recipe, Test } from "./recipe-type";
import { InputType, Field, ArgsType } from "../../src";
import { WhereModel, Where2Model } from "./where-model";

@InputType()
export class RecipeInput implements Partial<Recipe> {
  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;
}

// @ArgsType()
// export class RecipeArgs {
//   @Field()
//   test: string;

//   @Field(type => Test, { model: Where2Model })
//   test2: Where2Model<Test>
// }
