import { Field, ID, Int, ObjectType } from "type-graphql";

@ObjectType()
export class Recipe {
  @Field(_type => ID)
  id: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field(_type => [String])
  ingredients: string[];

  @Field(_type => Int)
  protected numberInCollection: number;

  @Field(_type => Int)
  protected get ingredientsLength(): number {
    return this.ingredients.length;
  }
}
