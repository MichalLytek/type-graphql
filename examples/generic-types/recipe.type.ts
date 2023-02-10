import { Field, ObjectType, Int } from "type-graphql";

@ObjectType()
export default class Recipe {
  @Field()
  title: string;

  @Field()
  description?: string;

  @Field(type => [Int])
  ratings: number[];
}
