import { Field, Int, ObjectType } from "type-graphql";
import type { Resource } from "../resource/resource";

@ObjectType()
export class Recipe implements Resource {
  @Field()
  id: number;

  @Field()
  title: string;

  @Field(type => [Int])
  ratings: number[];
}
