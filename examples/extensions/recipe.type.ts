import { ObjectType, Extensions, Field, Int, Float } from "../../src";
import { CustomAuthorized } from "./custom.authorized";

@ObjectType()
@CustomAuthorized() // restrict access to all receipe fields only for logged users
export class Recipe {
  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field(type => [String])
  @Extensions({ logMessage: "ingredients accessed" })
  @Extensions({ logLevel: 4 })
  ingredients: string[];

  @CustomAuthorized("ADMIN") // restrict access to rates details for admin only, this will override the object type custom authorization
  @Field(type => [Int])
  ratings: number[];

  @Field(type => Float, { nullable: true })
  get averageRating(): number | null {
    return this.ratings.reduce((a, b) => a + b, 0) / this.ratings.length;
  }
}
