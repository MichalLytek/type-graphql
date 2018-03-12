import { Field, GraphQLObjectType } from "../../src";

import { Difficulty } from "./difficulty.enum";
import { Cook } from "./cook.type";

@GraphQLObjectType()
export class Recipe {
  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field(type => [String])
  ingredients: string[];

  @Field(type => Difficulty)
  preparationDifficulty: Difficulty;

  @Field()
  cook: Cook;
}
