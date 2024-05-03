import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
export class Cook {
  @Field()
  name!: string;

  @Field(_type => Int)
  yearsOfExperience!: number;
}
