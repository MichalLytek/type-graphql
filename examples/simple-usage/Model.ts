import { Field, Model, Destination } from "../../src";
import { Recipe } from "./recipe-type";

@Model([Recipe])
export class RecipeModel {
  @Destination()
  where: Object;

  @Field()
  count: number;
}
