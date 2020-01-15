import { ObjectType, Extensions, Field, Int, Float } from "../../src";
import { Logger } from "./logger.decorator";

@ObjectType()
@Logger("Recipe accessed") // Log a message when any Recipe field is accessed
export class Recipe {
  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field(type => [String])
  @Extensions({ log: { message: "ingredients accessed", level: 0 } }) // We can use raw Extensions decorator if we want
  ingredients: string[];

  @Logger("Ratings accessed") // This will override the object type log message
  @Field(type => [Int])
  ratings: number[];

  @Field(type => Float, { nullable: true })
  get averageRating(): number | null {
    return this.ratings.reduce((a, b) => a + b, 0) / this.ratings.length;
  }
}
