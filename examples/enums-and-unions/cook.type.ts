import { Field, ObjectType, Int } from "../../src";
import { Recipe } from "./recipe.type";

@ObjectType()
export class Cook {
  @Field()
  name: string;

  @Field(type => Int)
  yearsOfExperience: number;
}
