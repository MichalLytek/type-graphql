import { Field, Float, Int, ObjectType, UseMiddleware } from "type-graphql";
import { LogAccessMiddleware, NumberInterceptor } from "../middlewares";

@ObjectType()
export class Recipe {
  @Field(_type => Int)
  id!: number;

  @Field()
  title!: string;

  @Field({ nullable: true })
  description?: string;

  @Field(_type => [Int])
  @UseMiddleware(LogAccessMiddleware)
  ratings!: number[];

  @Field(_type => Float, { nullable: true })
  @UseMiddleware(NumberInterceptor(3))
  get averageRating(): number | null {
    const ratingsCount = this.ratings.length;
    if (ratingsCount === 0) {
      return null;
    }
    const ratingsSum = this.ratings.reduce((a, b) => a + b, 0);
    return ratingsSum / ratingsCount;
  }
}
