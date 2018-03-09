import { Field, ID, GraphQLObjectType, Int, Float } from "../../src";

@GraphQLObjectType({ description: "Object representing cooking recipe" })
export class Recipe {
  @Field()
  title: string;

  @Field({ nullable: true, description: "The recipe description with preparation info" })
  description?: string;

  @Field()
  creationDate: Date;
}
