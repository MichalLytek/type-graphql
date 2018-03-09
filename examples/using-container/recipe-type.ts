import { Field, ID, GraphQLObjectType, Int } from "../../src/index";

@GraphQLObjectType()
export class Recipe {
  @Field(type => ID)
  id: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field(type => String)
  ingredients: string[];

  @Field(type => Int)
  private numberInCollection: number;

  @Field(type => Int)
  private get ingredientsLength(): number {
    return this.ingredients.length;
  }
}
