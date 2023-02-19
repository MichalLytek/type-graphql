import { Field, ObjectType } from "type-graphql";
import { Cook } from "./cook.type";
import { Difficulty } from "./difficulty.enum";

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
