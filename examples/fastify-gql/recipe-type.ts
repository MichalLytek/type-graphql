import { Field, ObjectType } from "../../src";

@ObjectType()
export class Recipe {
  @Field()
  title: string;

  @Field()
  creationDate: Date;
}
