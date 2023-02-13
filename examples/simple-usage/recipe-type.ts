import { Field, ObjectType } from "type-graphql";
import { GraphQLInt, GraphQLFloat } from "graphql";

@ObjectType({ description: "Object representing cooking recipe" })
export class Recipe {
  @Field()
  title: string;

  @Field(() => String, { nullable: true, deprecationReason: "Use 'description' field instead" })
  get specification(): string | undefined {
    return this.description;
  }

  @Field({ nullable: true, description: "The recipe description with preparation info" })
  description?: string;

  @Field(() => [GraphQLInt])
  ratings: number[];

  @Field()
  creationDate: Date;

  @Field(() => GraphQLInt)
  ratingsCount: number;

  @Field(() => GraphQLFloat, { nullable: true })
  get averageRating(): number | null {
    const ratingsCount = this.ratings.length;
    if (ratingsCount === 0) return null;
    const ratingsSum = this.ratings.reduce((a, b) => a + b, 0);

    return ratingsSum / ratingsCount;
  }
}
