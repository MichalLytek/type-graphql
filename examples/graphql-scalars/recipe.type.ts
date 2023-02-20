import {
  GraphQLNonEmptyString,
  GraphQLNonNegativeFloat,
  GraphQLNonNegativeInt,
  GraphQLTimestamp,
} from "graphql-scalars";
import { Field, ObjectType } from "type-graphql";

@ObjectType({ description: "Object representing cooking recipe" })
export class Recipe {
  @Field(_type => GraphQLNonEmptyString)
  title: string;

  @Field(_type => GraphQLNonEmptyString, {
    nullable: true,
    deprecationReason: "Use 'description' field instead",
  })
  get specification(): string | undefined {
    return this.description;
  }

  @Field(_type => GraphQLNonEmptyString, {
    nullable: true,
    description: "The recipe description with preparation info",
  })
  description?: string;

  @Field(_type => [GraphQLNonNegativeInt])
  ratings: number[];

  @Field(_type => GraphQLTimestamp)
  creationDate: Date;

  @Field(_type => GraphQLNonNegativeInt)
  ratingsCount: number;

  @Field(_type => GraphQLNonNegativeFloat, { nullable: true })
  get averageRating(): number | null {
    const ratingsCount = this.ratings.length;
    if (ratingsCount === 0) return null;
    const ratingsSum = this.ratings.reduce((a, b) => a + b, 0);

    return ratingsSum / ratingsCount;
  }
}
