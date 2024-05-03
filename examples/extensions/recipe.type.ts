import { Extensions, Field, Float, Int, ObjectType } from "type-graphql";
import { LogMessage } from "./log-message.decorator";

@ObjectType()
// Log a message when any Recipe field is accessed
@LogMessage("Recipe field accessed")
export class Recipe {
  @Field()
  title!: string;

  @Field({ nullable: true })
  description?: string;

  @Field(_type => [String])
  // Use raw 'Extensions' decorator
  @Extensions({ log: { message: "Ingredients field accessed", level: 0 } })
  ingredients!: string[];

  // Override the object type log message
  @LogMessage("Ratings accessed")
  @Field(_type => [Int])
  ratings!: number[];

  @Field(_type => Float, { nullable: true })
  get averageRating(): number | null {
    if (!this.ratings.length) {
      return null;
    }
    return this.ratings.reduce((a, b) => a + b, 0) / this.ratings.length;
  }
}
