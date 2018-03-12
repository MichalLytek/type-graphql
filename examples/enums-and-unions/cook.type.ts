import { Field, GraphQLObjectType, Int } from "../../src";
import { Recipe } from "./recipe.type";

@GraphQLObjectType()
export class Cook {
  @Field()
  name: string;

  @Field(type => Int)
  yearsOfExperience: number;
}
