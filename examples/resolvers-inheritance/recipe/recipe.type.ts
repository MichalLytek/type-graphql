import { ObjectType, Field, Int } from "../../../src";

import { Resource } from "../resource/resource";

@ObjectType()
export class Recipe implements Resource {
  @Field()
  id: number;

  @Field()
  title: string;

  @Field(type => [Int])
  ratings: number[];
}
