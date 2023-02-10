import { Field, ObjectType, Int } from "type-graphql";

@ObjectType()
export class Cook {
  @Field()
  name: string;

  @Field(type => Int)
  yearsOfExperience: number;
}
