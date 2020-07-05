import { Field, ObjectType, Int } from "../../../src";

@ObjectType()
export default class Recipe {
  @Field(type => Int)
  id: number;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  creationDate: Date;

  authorId: number;
}
