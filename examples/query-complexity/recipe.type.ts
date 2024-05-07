import { Field, Float, Int, ObjectType } from "type-graphql";

@ObjectType()
export class Recipe {
  /* By default, every field gets a complexity of 1 */
  @Field()
  title!: string;

  /* Which can be customized by passing the complexity parameter */
  @Field(_type => Int, { complexity: 2 })
  ratingsCount!: number;

  @Field(_type => Float, {
    nullable: true,
    complexity: 10,
  })
  get averageRating(): number | null {
    const ratingsCount = this.ratings.length;
    if (ratingsCount === 0) {
      return null;
    }
    const ratingsSum = this.ratings.reduce((a, b) => a + b, 0);
    return ratingsSum / ratingsCount;
  }

  // Internal property, not exposed in schema
  ratings!: number[];
}
