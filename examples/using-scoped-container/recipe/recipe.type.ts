import { Field, ID, ObjectType } from "type-graphql";

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
}
