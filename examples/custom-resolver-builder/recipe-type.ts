import { Field, ObjectType, Int, Float } from "../../src";

@ObjectType({ description: "Object representing cooking recipe" })
export class Recipe {
  @Field()
  title: string;

  @Field({ nullable: true, description: "The recipe description with preparation info" })
  description?: string;

  @Field(type => [Int])
  ratings: number[];

  @Field()
  creationDate: Date;
}
