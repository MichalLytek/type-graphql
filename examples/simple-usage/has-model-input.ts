import { Field, InputType } from "../../src";
import { Recipe } from "./recipe-type";
import { WhereModelInput } from "./where-model";

@InputType()
export class HasModelInput {
  @Field(type => [Recipe], { model: WhereModelInput })
  items: Array<WhereModelInput<Recipe>>;
}
