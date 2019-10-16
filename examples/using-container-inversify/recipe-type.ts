import { Field, ID, ObjectType, Int } from "../../src";

@ObjectType()
export class Recipe {
  @Field(type => ID)
  id: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field(type => [String])
  ingredients: string[];

  @Field(type => Int)
  protected numberInCollection: number;

  @Field(type => Int)
  protected get ingredientsLength(): number {
    return this.ingredients.length;
  }
}
