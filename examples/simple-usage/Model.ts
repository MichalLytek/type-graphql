import { Field, Model, Destination } from "../../src";
import { Recipe, Test } from "./recipe-type";

@Model({ models: [Recipe, Test] })
export class WhereModel {
  @Destination({ nullable: true })
  where: Object;

  @Destination()
  where2: Object;

  @Field()
  count: number;
}
