import { Field, ID, GraphQLObjectType, Int, Float } from "../../src/index";

@GraphQLObjectType({ description: "Object representing cooking recipe" })
export class Recipe {
  @Field()
  title: string;

  @Field(type => String, { nullable: true, deprecationReason: "Use `description` field instead" })
  get specification(): string | undefined {
    return this.description;
  }

  @Field({ nullable: true, description: "The recipe description with preparation info" })
  description?: string;

  @Field(type => Int)
  ratings: number[];

  @Field({description: "Creation date field.", nullable: false})
  created: Date;

  @Field(type => Int)
  // declare the field as private because it won't exist in root object
  private ratingsCount: number;

  @Field(type => Float, { nullable: true })
  get averageRating(): number | null {
    const ratingsCount = this.ratings.length;
    if (ratingsCount === 0) {
      return null;
    }
    const ratingsSum = this.ratings.reduce((a, b) => a + b, 0);
    return ratingsSum / ratingsCount;
  }
}
