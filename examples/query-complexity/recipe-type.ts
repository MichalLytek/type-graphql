import { Field, ObjectType, Int, Float } from "../../src";

@ObjectType({ description: "Object representing cooking recipe" })
export class Recipe {
  /*
    By default, every field gets a complexity of 1.
    Which can be customized by passing the complexity parameter
  */
  @Field({ complexity: 6 })
  title: string;

  @Field({ complexity: 5 })
  description?: string;

  @Field(type => [Int])
  ratings: number[];

  @Field(type => Int, { complexity: 5 })
  ratingsCount: number;

  @Field(type => Float, {
    nullable: true,
    /*
    By default, every field gets a complexity of 1.
    You can also pass a calculation function in the complexity option
    to determine a custom complexity.
    This function will provide the complexity of
    the child nodes as well as the field input arguments.
    That way you can make a more realistic estimation of individual field complexity values:
   */
    complexity: ({ childComplexity }) => childComplexity + 1,
  })
  get averageRating(): number | null {
    const ratingsCount = this.ratings.length;
    if (ratingsCount === 0) {
      return null;
    }
    const ratingsSum = this.ratings.reduce((a, b) => a + b, 0);
    return ratingsSum / ratingsCount;
  }
}
