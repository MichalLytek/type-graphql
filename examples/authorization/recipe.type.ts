import { Authorized, Field, Float, Int, ObjectType } from "type-graphql";

@ObjectType()
export class Recipe {
  @Field()
  title!: string;

  @Field({ nullable: true })
  description?: string;

  @Authorized() // Restrict access only for authenticated users
  @Field(_type => [String])
  ingredients!: string[];

  @Authorized("ADMIN") // Restrict access only for 'ADMIN' users
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
