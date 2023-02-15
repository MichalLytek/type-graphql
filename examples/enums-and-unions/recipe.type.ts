import { Field, ObjectType } from "type-graphql";
import { Difficulty } from "./difficulty.enum";
import { Cook } from "./cook.type";

@ObjectType()
export class Recipe {
  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field(_type => [String])
  ingredients: string[];

  @Field(_type => Difficulty)
  preparationDifficulty: Difficulty;

  @Field()
  cook: Cook;
}
