import { Field, ObjectType } from "../../src";

@ObjectType()
export class Recipe {
  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  creationDate: Date;
}
